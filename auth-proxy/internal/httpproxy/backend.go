package httpproxy

import (
	"context"
	"fmt"
	"math/rand"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"sync"
	"time"
)

type director func(*http.Request)

type directorID string

func newDirectorIDFromSRV(srv *net.SRV) directorID {
	return directorID(srvToTCPAddr(srv))
}

// DNSSRVBackend bestows httputil.ReverseProxy with the ability to forward a
// request to backends discovered via DNS SRV records.  This type automatically
// degrades to a conventional 'single host' reverse proxy if DNS SRV records are
// not in use.
//
// Initialise with NewDNSSRVBackend, call the Lookup method, then assign a
// reference to the Director method in a ReverseProxy value.  Refer to the
// documentation for the Lookup and Director methods for quirks.
//
// The DNSSRVBackend does not currently offer its own SRV-aware transport for
// SRV-compatible retries; this omission will almost certainly lead to pain and
// suffering if your DNS SRV records are subject to constant churn.  Client-side
// retries may be used to mitigate these effects.
type DNSSRVBackend struct {
	target           *url.URL
	fallbackDirector director

	srvsLock sync.RWMutex
	srvs     []*net.SRV

	// directors is a map of memoised director funcs.  Used to optimise the
	// common case of many requests to a mostly static set of backends.
	directors map[directorID]director
}

// NewDNSSRVBackend returns a new DNSSRVBackend value.  The host in target will
// eventually be queried for DNS SRV records.  If none are found, or if the host
// specifies an IPv4/6 address, the Director method will proxy directly to the
// literal value of target, bypassing all SRV functionality.  Path and query
// semantics are identical to the httputil package's NewSingleHostReverseProxy
// function.  DNS SRV records will not begin to influence Director method
// behaviour until the Lookup method is called.
func NewDNSSRVBackend(target *url.URL) *DNSSRVBackend {
	return &DNSSRVBackend{
		target:           target,
		fallbackDirector: initDirector(target),
		directors:        make(map[directorID]director),
	}
}

// Lookup continuously polls the DNS for new target SRV records.  One lookup is
// made shortly upon entry into this function, then every interval thereafter.
// A random value between zero and jitter is applied to each interval.  The
// function will return if no SRV records are found after abandon, which may be
// set to zero in order to keep the function alive.
//
// Results from the most recent successful lookup are used by the Director
// function.  DNS TTLs are not honoured.  This quirk is considered to be a bug,
// and may be fixed at a later date.
//
// Because the SRV priority field only makes sense within the context of
// retries, and because the DNSSRVBackend does not currently offer any mechanism
// that implements SRV-compatible retries, the Lookup method discards all but
// the most-preferred targets by priority.  In other words, given the following
// set of SRV RRs:
//
//     _foobar._tcp    SRV 0 1 9 old-slow-box.example.com.
//                     SRV 0 3 9 new-fast-box.example.com.
//                     SRV 1 0 9 sysadmins-box.example.com.
//                     SRV 1 0 9 server.example.com.
//
// Lookup will discard 'sysadmins-box' and 'server'.  Only 'old-slow-box' and
// 'new-fast-box' will be cached for later use.  (The priority field need not be
// zero, nor need it be constant over time.)
//
// ctx may be used to cancel the execution of this function.  The caller is
// expected to call this function in its own goroutine.
func (b *DNSSRVBackend) Lookup(ctx context.Context, interval, jitter, abandon time.Duration) {
	if _, resolvable := b.name(); !resolvable {
		return
	}

	var (
		noexpire = func() bool { return true }
		again    = noexpire
	)
	if abandon != time.Duration(0) {
		deadline := time.Now().Add(abandon)
		again = func() bool { return time.Now().Before(deadline) }
	}

lookup:
	for {
		if err := b.lookupOne(ctx); err == nil {
			// SRV records are in use.  Hang around for future updates.
			again = noexpire
		}
		if !again() {
			break lookup
		}
		select {
		case <-ctx.Done():
			break lookup
		case <-time.After(interval + randomJitter(jitter)):
		}
	}
}

// Director implements a httputil.ReverseProxy Director.  The host and port from
// req are replaced with values taken from an SRV record if any such record is
// found in the DNS.  When multiple SRV records are found in the DNS, each
// request is assigned a backend in keeping with SRV weights.  The director does
// not implement any form of backend affinity.
//
// SRV lookups are handled outside the critical path:  see the Lookup method.
func (b *DNSSRVBackend) Director(req *http.Request) {
	d := b.findDirector()
	d(req)
}

func (b *DNSSRVBackend) lookupOne(ctx context.Context) error {
	name, _ := b.name()
	_, srvs, err := net.DefaultResolver.LookupSRV(ctx, "", "", name)
	if err != nil {
		return err
	}
	b.setSrvs(srvFilterTopPriority(srvs))
	return nil
}

func (b *DNSSRVBackend) findDirector() director {
	srvs := b.getSrvs()
	if srvs == nil || len(srvs) == 0 {
		return b.fallbackDirector
	}

	srvShuffleByWeight(srvs)
	srv := srvs[0]

	id := newDirectorIDFromSRV(srv)
	if d, ok := b.directors[id]; ok {
		return d
	}
	d := initDirectorFromSRV(b.target, srv)
	b.directors[id] = d
	return d
}

func (b *DNSSRVBackend) getSrvs() []*net.SRV {
	var srvs []*net.SRV
	b.srvsLock.RLock()
	if b.srvs != nil {
		srvs = make([]*net.SRV, len(b.srvs))
		copy(srvs, b.srvs)
	}
	b.srvsLock.RUnlock()
	return srvs
}

func (b *DNSSRVBackend) setSrvs(srvs []*net.SRV) {
	b.srvsLock.Lock()
	b.srvs = srvs
	b.srvsLock.Unlock()
}

// name returns the host component from b.target and a boolean indicating
// whether the host component is likely to be a resolvable name.
func (b *DNSSRVBackend) name() (string, bool) {

	// We could try to match against the record naming patterns described in RFC
	// 2782 (and further elaborated on in RFC 6763), but it's easier to be more
	// permissive in this specific case.  Anything that ain't an IPv4/6 address
	// is fair game.

	host := b.target.Hostname()
	resolvable := false
	if net.ParseIP(host) == nil {
		resolvable = true
	}
	return host, resolvable
}

func initDirector(target *url.URL) director {
	rp := httputil.NewSingleHostReverseProxy(target)
	return rp.Director
}

func initDirectorFromSRV(target *url.URL, srv *net.SRV) director {
	t := *target
	t.Host = srvToTCPAddr(srv)
	return initDirector(&t)
}

func srvToTCPAddr(srv *net.SRV) string {
	return fmt.Sprintf("%s:%d", srv.Target, srv.Port)
}

// srvFilterTopPriority returns, from srvs, the set of SRV RRs that share the
// most-preferred priority, whatever that priority value might be.   Relative RR
// ordering within this set is maintained.  srvs is expected to be pre-sorted by
// priority.  (The net resolver will automatically sort SRV RRs by prio.)
func srvFilterTopPriority(srvs []*net.SRV) []*net.SRV {
	if len(srvs) == 0 {
		return []*net.SRV{}
	}

	var (
		top  = make([]*net.SRV, 0, len(srvs))
		prio = srvs[0].Priority
	)
	for _, s := range srvs {
		if s.Priority != prio {
			break
		}
		top = append(top, s)
	}
	return top
}

// srvShuffleByWeight applies the weight shuffling algorithm described in RFC
// 2782 to a slice of SRV RRs of equivalent priority.
//
// This implementation was shamelessly clagged from the Go standard library.
func srvShuffleByWeight(srvs []*net.SRV) {
	sum := 0
	for _, srv := range srvs {
		sum += int(srv.Weight)
	}

	for sum > 0 && len(srvs) > 1 {
		s := 0
		n := rand.Intn(sum)
		for i := range srvs {
			s += int(srvs[i].Weight)
			if s > n {
				if i > 0 {
					srvs[0], srvs[i] = srvs[i], srvs[0]
				}
				break
			}
		}
		sum -= int(srvs[0].Weight)
		srvs = srvs[1:]
	}
}

func randomJitter(max time.Duration) time.Duration {
	m := int64(max)
	if m == 0 {
		return time.Duration(0)
	}
	return time.Duration(rand.Int63n(m))
}
