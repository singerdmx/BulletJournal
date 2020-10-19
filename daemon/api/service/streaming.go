package service

type Streaming struct {
	ServiceName string
	ServiceChannel chan *StreamingMessage
}

type StreamingMessage struct {
	ServiceName string
	Message uint64
	Err error
}
