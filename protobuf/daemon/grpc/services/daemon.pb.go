// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.24.0
// 	protoc        v3.12.3
// source: daemon/grpc/services/daemon.proto

package services

import (
	context "context"
	proto "github.com/golang/protobuf/proto"
	types "github.com/singerdmx/BulletJournal/protobuf/daemon/grpc/types"
	_ "google.golang.org/genproto/googleapis/api/annotations"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// This is a compile-time assertion that a sufficiently up-to-date version
// of the legacy proto package is being used.
const _ = proto.ProtoPackageIsVersion4

var File_daemon_grpc_services_daemon_proto protoreflect.FileDescriptor

var file_daemon_grpc_services_daemon_proto_rawDesc = []byte{
	0x0a, 0x21, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2f, 0x67, 0x72, 0x70, 0x63, 0x2f, 0x73, 0x65,
	0x72, 0x76, 0x69, 0x63, 0x65, 0x73, 0x2f, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x12, 0x08, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x73, 0x1a, 0x29, 0x64,
	0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2f, 0x67, 0x72, 0x70, 0x63, 0x2f, 0x74, 0x79, 0x70, 0x65, 0x73,
	0x2f, 0x6a, 0x6f, 0x69, 0x6e, 0x5f, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x5f, 0x65, 0x76, 0x65, 0x6e,
	0x74, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x1c, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65,
	0x2f, 0x61, 0x70, 0x69, 0x2f, 0x61, 0x6e, 0x6e, 0x6f, 0x74, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x73,
	0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x32, 0x95, 0x01, 0x0a, 0x06, 0x44, 0x61, 0x65, 0x6d, 0x6f,
	0x6e, 0x12, 0x42, 0x0a, 0x0f, 0x4a, 0x6f, 0x69, 0x6e, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x45, 0x76,
	0x65, 0x6e, 0x74, 0x73, 0x12, 0x16, 0x2e, 0x74, 0x79, 0x70, 0x65, 0x73, 0x2e, 0x4a, 0x6f, 0x69,
	0x6e, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x73, 0x1a, 0x13, 0x2e, 0x74,
	0x79, 0x70, 0x65, 0x73, 0x2e, 0x52, 0x65, 0x70, 0x6c, 0x79, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67,
	0x65, 0x22, 0x00, 0x30, 0x01, 0x12, 0x47, 0x0a, 0x04, 0x52, 0x65, 0x73, 0x74, 0x12, 0x16, 0x2e,
	0x74, 0x79, 0x70, 0x65, 0x73, 0x2e, 0x4a, 0x6f, 0x69, 0x6e, 0x47, 0x72, 0x6f, 0x75, 0x70, 0x45,
	0x76, 0x65, 0x6e, 0x74, 0x73, 0x1a, 0x13, 0x2e, 0x74, 0x79, 0x70, 0x65, 0x73, 0x2e, 0x52, 0x65,
	0x70, 0x6c, 0x79, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x22, 0x12, 0x82, 0xd3, 0xe4, 0x93,
	0x02, 0x0c, 0x22, 0x07, 0x2f, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x3a, 0x01, 0x2a, 0x42, 0x82,
	0x01, 0x0a, 0x2f, 0x63, 0x6f, 0x6d, 0x2e, 0x62, 0x75, 0x6c, 0x6c, 0x65, 0x74, 0x6a, 0x6f, 0x75,
	0x72, 0x6e, 0x61, 0x6c, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x64, 0x61,
	0x65, 0x6d, 0x6f, 0x6e, 0x2e, 0x67, 0x72, 0x70, 0x63, 0x2e, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63,
	0x65, 0x73, 0x42, 0x0b, 0x44, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x50, 0x72, 0x6f, 0x74, 0x6f, 0x50,
	0x01, 0x5a, 0x40, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x73, 0x69,
	0x6e, 0x67, 0x65, 0x72, 0x64, 0x6d, 0x78, 0x2f, 0x42, 0x75, 0x6c, 0x6c, 0x65, 0x74, 0x4a, 0x6f,
	0x75, 0x72, 0x6e, 0x61, 0x6c, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x64,
	0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2f, 0x67, 0x72, 0x70, 0x63, 0x2f, 0x73, 0x65, 0x72, 0x76, 0x69,
	0x63, 0x65, 0x73, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var file_daemon_grpc_services_daemon_proto_goTypes = []interface{}{
	(*types.JoinGroupEvents)(nil), // 0: types.JoinGroupEvents
	(*types.ReplyMessage)(nil),    // 1: types.ReplyMessage
}
var file_daemon_grpc_services_daemon_proto_depIdxs = []int32{
	0, // 0: services.Daemon.JoinGroupEvents:input_type -> types.JoinGroupEvents
	0, // 1: services.Daemon.Rest:input_type -> types.JoinGroupEvents
	1, // 2: services.Daemon.JoinGroupEvents:output_type -> types.ReplyMessage
	1, // 3: services.Daemon.Rest:output_type -> types.ReplyMessage
	2, // [2:4] is the sub-list for method output_type
	0, // [0:2] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_daemon_grpc_services_daemon_proto_init() }
func file_daemon_grpc_services_daemon_proto_init() {
	if File_daemon_grpc_services_daemon_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_daemon_grpc_services_daemon_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   0,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_daemon_grpc_services_daemon_proto_goTypes,
		DependencyIndexes: file_daemon_grpc_services_daemon_proto_depIdxs,
	}.Build()
	File_daemon_grpc_services_daemon_proto = out.File
	file_daemon_grpc_services_daemon_proto_rawDesc = nil
	file_daemon_grpc_services_daemon_proto_goTypes = nil
	file_daemon_grpc_services_daemon_proto_depIdxs = nil
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConnInterface

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion6

// DaemonClient is the client API for Daemon service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type DaemonClient interface {
	// Serve rpc call sending JoinGroupEvents
	JoinGroupEvents(ctx context.Context, in *types.JoinGroupEvents, opts ...grpc.CallOption) (Daemon_JoinGroupEventsClient, error)
	// Serve rest call sending JoinGroupEvents
	Rest(ctx context.Context, in *types.JoinGroupEvents, opts ...grpc.CallOption) (*types.ReplyMessage, error)
}

type daemonClient struct {
	cc grpc.ClientConnInterface
}

func NewDaemonClient(cc grpc.ClientConnInterface) DaemonClient {
	return &daemonClient{cc}
}

func (c *daemonClient) JoinGroupEvents(ctx context.Context, in *types.JoinGroupEvents, opts ...grpc.CallOption) (Daemon_JoinGroupEventsClient, error) {
	stream, err := c.cc.NewStream(ctx, &_Daemon_serviceDesc.Streams[0], "/services.Daemon/JoinGroupEvents", opts...)
	if err != nil {
		return nil, err
	}
	x := &daemonJoinGroupEventsClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type Daemon_JoinGroupEventsClient interface {
	Recv() (*types.ReplyMessage, error)
	grpc.ClientStream
}

type daemonJoinGroupEventsClient struct {
	grpc.ClientStream
}

func (x *daemonJoinGroupEventsClient) Recv() (*types.ReplyMessage, error) {
	m := new(types.ReplyMessage)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (c *daemonClient) Rest(ctx context.Context, in *types.JoinGroupEvents, opts ...grpc.CallOption) (*types.ReplyMessage, error) {
	out := new(types.ReplyMessage)
	err := c.cc.Invoke(ctx, "/services.Daemon/Rest", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// DaemonServer is the server API for Daemon service.
type DaemonServer interface {
	// Serve rpc call sending JoinGroupEvents
	JoinGroupEvents(*types.JoinGroupEvents, Daemon_JoinGroupEventsServer) error
	// Serve rest call sending JoinGroupEvents
	Rest(context.Context, *types.JoinGroupEvents) (*types.ReplyMessage, error)
}

// UnimplementedDaemonServer can be embedded to have forward compatible implementations.
type UnimplementedDaemonServer struct {
}

func (*UnimplementedDaemonServer) JoinGroupEvents(*types.JoinGroupEvents, Daemon_JoinGroupEventsServer) error {
	return status.Errorf(codes.Unimplemented, "method JoinGroupEvents not implemented")
}
func (*UnimplementedDaemonServer) Rest(context.Context, *types.JoinGroupEvents) (*types.ReplyMessage, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Rest not implemented")
}

func RegisterDaemonServer(s *grpc.Server, srv DaemonServer) {
	s.RegisterService(&_Daemon_serviceDesc, srv)
}

func _Daemon_JoinGroupEvents_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(types.JoinGroupEvents)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(DaemonServer).JoinGroupEvents(m, &daemonJoinGroupEventsServer{stream})
}

type Daemon_JoinGroupEventsServer interface {
	Send(*types.ReplyMessage) error
	grpc.ServerStream
}

type daemonJoinGroupEventsServer struct {
	grpc.ServerStream
}

func (x *daemonJoinGroupEventsServer) Send(m *types.ReplyMessage) error {
	return x.ServerStream.SendMsg(m)
}

func _Daemon_Rest_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(types.JoinGroupEvents)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DaemonServer).Rest(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/services.Daemon/Rest",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DaemonServer).Rest(ctx, req.(*types.JoinGroupEvents))
	}
	return interceptor(ctx, in, info, handler)
}

var _Daemon_serviceDesc = grpc.ServiceDesc{
	ServiceName: "services.Daemon",
	HandlerType: (*DaemonServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Rest",
			Handler:    _Daemon_Rest_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "JoinGroupEvents",
			Handler:       _Daemon_JoinGroupEvents_Handler,
			ServerStreams: true,
		},
	},
	Metadata: "daemon/grpc/services/daemon.proto",
}
