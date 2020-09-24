package investment

import (
	"io"
	"io/ioutil"
	"net/http"
	"time"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"github.com/pkg/errors"
)

var log logging.Logger

const (
	defaultTimeout = 10 * time.Second
)

type Requester struct {
	httpClient *http.Client
	Name       string
}

type Response struct {
	Status        string // e.g. "200 OK"
	StatusCode    int    // e.g. 200
	Header        http.Header
	Body          []byte
	ContentLength int64
}

/*
	Function: return a new Requester Instance
*/
func NewRequester(name string) *Requester {
	return &Requester{
		httpClient: &http.Client{Timeout: defaultTimeout},
		Name:       name,
	}
}

/*
	Function: Standard rest request procedure wrapper
*/
func (r *Requester) RequestREST(method, path string, headers map[string]string, body io.Reader) (*Response, error) {
	req, err := http.NewRequest(method, path, body)
	if err != nil {
		log.Error("http new request failed",
			"error", err,
		)
		return nil, errors.Wrap(err, "http new request failed")
	}
	for k, v := range headers {
		req.Header.Add(k, v)
	}
	resp, err := r.httpClient.Do(req)
	if err != nil {
		log.Error("http sending request failed",
			"error", err,
		)
		return nil, errors.Wrap(err, "http sending request failed")
	}
	defer resp.Body.Close()

	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		// unknown
		log.Error("cannot read response body")
		respBody = []byte{}
		err = errors.Wrap(err, "cannot read response body")
	}

	return &Response{
		Status:        resp.Status,
		StatusCode:    resp.StatusCode,
		Header:        resp.Header,
		Body:          respBody,
		ContentLength: resp.ContentLength,
	}, err
}