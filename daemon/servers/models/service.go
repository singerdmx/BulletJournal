package models

type DaemonStreamingService struct {
	ServiceName string
	ServiceChannel chan *ServiceMessage
}

type ServiceMessage struct {
	ServiceName string
	Message uint
	Err error
}
