package services

type Streaming struct {
	ServiceName string
	ServiceChannel chan *StreamingMessage
}

type StreamingMessage struct {
	ServiceName string
	Message uint
	Err error
}
