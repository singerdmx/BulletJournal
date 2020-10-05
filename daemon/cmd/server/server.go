package server

import (
	"context"
	"log"
	"strconv"
	"strings"

	"github.com/singerdmx/BulletJournal/daemon/api/middleware"
	"github.com/singerdmx/BulletJournal/daemon/api/service"
	daemon "github.com/singerdmx/BulletJournal/daemon/api/service"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
	"github.com/singerdmx/BulletJournal/daemon/utils"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/services"
	"github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/types"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

const (
	bulletJournalId     string = "bulletJournal"
	FanInServiceName    string = "fanIn"
	CleanerServiceName  string = "cleaner"
	ReminderServiceName string = "reminder"
)

// server should implement services.UnimplementedDaemonServer's methods
type Server struct {
	ServiceConfig          *config.Config
	subscriptions          map[string][]daemon.Streaming
	messageService         *service.MessageService
	etagDao                *persistence.EtagDao
	joinGroupInvitationDao *persistence.JoinGroupInvitationDao
}

func NewServer(ctx context.Context, services []daemon.Streaming) *Server {
	// Get config
	serviceConfig := config.GetConfig()

	// Get clients
	redisClient := persistence.GetRedisClient(serviceConfig)
	mailClient, err := persistence.GetMailClient()
	if err != nil {
		log.Printf("Failed to initialize mail client: %v", err)
	}

	// Get DAOs
	etagDao := persistence.InitializeEtagDao(ctx, redisClient)
	groupDao := persistence.NewGroupDao(ctx)
	joinGroupInvitationDao := persistence.InitializeJoinGroupInvitationDao(ctx, redisClient)

	// Get services
	messageService := daemon.NewMessageService(groupDao, joinGroupInvitationDao, mailClient)

	return &Server{
		ServiceConfig:          serviceConfig,
		subscriptions:          map[string][]daemon.Streaming{bulletJournalId: services},
		messageService:         messageService,
		etagDao:                etagDao,
		joinGroupInvitationDao: joinGroupInvitationDao,
	}
}

// HealthCheck implements the rest endpoint healthcheck -> rpc
func (s *Server) HealthCheck(ctx context.Context, request *types.HealthCheckRequest) (*types.HealthCheckResponse, error) {
	log.Printf("Received health check request: %v", request.String())
	return &types.HealthCheckResponse{}, nil
}

// Send implements the JoinGroupEvents rpc endpoint of services.DaemonServer
func (s *Server) JoinGroupEvents(ctx context.Context, request *types.JoinGroupEvents) (*types.ReplyMessage, error) {
	log.Printf("Received rpc request: %v", request.String())
	return &types.ReplyMessage{Message: "Hello daemon"}, nil
}

// Rest implements the Rest rest->rpc endpoint of services.DaemonServer
func (s *Server) HandleJoinGroupResponse(ctx context.Context, request *types.JoinGroupResponse) (*types.ReplyMessage, error) {
	if meta, ok := metadata.FromIncomingContext(ctx); ok {
		if requestId, ok := meta[strings.ToLower(middleware.RequestIDKey)]; ok {
			log.Printf(middleware.RequestIDKey+": %v", requestId[0])
			grpc.SendHeader(ctx, metadata.Pairs(middleware.RequestIDKey, requestId[0]))
		} else {
			requestId := utils.GenerateUID()
			log.Printf(middleware.RequestIDKey+": %v", requestId)
			grpc.SendHeader(ctx, metadata.Pairs(middleware.RequestIDKey, requestId))
		}
	}
	log.Printf("Received JoinGroupResponse request: %v", request.String())
	// get username from uid
	invitation := s.joinGroupInvitationDao.Find(request.Uid)
	// then delete etags
	s.etagDao.DeleteEtagByUserName(invitation.Username)
	// finally delete edges
	// TODO: call usergroup dao
	return &types.ReplyMessage{Message: "Hello daemon"}, nil
}

func (s *Server) SubscribeNotification(subscribe *types.SubscribeNotification, stream services.Daemon_SubscribeNotificationServer) error {
	log.Printf("Received rpc request for subscription: %s", subscribe.String())
	if _, ok := s.subscriptions[subscribe.Id]; ok {
		log.Printf("Subscription: %s's streaming has been idle, start streaming!", subscribe.String())
		daemonServices := s.subscriptions[subscribe.Id]
		// Prevent requests with the same subscribe.Id from new subscriptions
		delete(s.subscriptions, subscribe.Id)
		// Keep the subscription session alive
		var fanInChannel chan *daemon.StreamingMessage
		for _, service := range daemonServices {
			if service.ServiceName == FanInServiceName {
				fanInChannel = service.ServiceChannel
			} else {
				go func(service daemon.Streaming) {
					for message := range service.ServiceChannel {
						message.ServiceName = service.ServiceName
						log.Printf("Preparing streaming: %v to subscription: %s", message, subscribe.String())
						fanInChannel <- message
					}
				}(service)
			}
		}
		for service := range fanInChannel {
			if service == nil {
				log.Printf("Service: %s for subscription: %s is closed", service.ServiceName, subscribe.String())
				log.Printf("Closing streaming to subscription: %s", subscribe.String())
				break
			} else if service.ServiceName == CleanerServiceName {
				projectId := strconv.Itoa(int(service.Message))
				if err := stream.Send(&types.StreamMessage{Id: CleanerServiceName, Message: projectId}); err != nil {
					log.Printf("Unexpected error happened to subscription: %s, error: %v", subscribe.String(), err)
					// Allow future requests with the same subscribe.Id from new subscriptions
					s.subscriptions[subscribe.Id] = daemonServices
					log.Printf("Transition streaming to idle for subscription: %s", subscribe.String())
					break
				} else {
					log.Printf("Streaming projectId: %s to subscription: %s", projectId, subscribe.String())
				}
			} else {
				log.Printf("Service: %s for subscription: %s is not implemented as for now", service.ServiceName, subscribe.String())
			}
		}
	} else {
		log.Printf("Subscription %s is already streaming!", subscribe.String())
	}
	return nil
}
