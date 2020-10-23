package service

type StreamingMessage struct {
	ServiceName string
	Message uint64
	Err error
}
