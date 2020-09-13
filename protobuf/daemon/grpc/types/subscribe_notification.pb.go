// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.23.0
// 	protoc        v3.13.0
// source: daemon/grpc/types/subscribe_notification.proto

package types

import (
	proto "github.com/golang/protobuf/proto"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
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

type SubscribeNotification struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
}

func (x *SubscribeNotification) Reset() {
	*x = SubscribeNotification{}
	if protoimpl.UnsafeEnabled {
		mi := &file_daemon_grpc_types_subscribe_notification_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *SubscribeNotification) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*SubscribeNotification) ProtoMessage() {}

func (x *SubscribeNotification) ProtoReflect() protoreflect.Message {
	mi := &file_daemon_grpc_types_subscribe_notification_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use SubscribeNotification.ProtoReflect.Descriptor instead.
func (*SubscribeNotification) Descriptor() ([]byte, []int) {
	return file_daemon_grpc_types_subscribe_notification_proto_rawDescGZIP(), []int{0}
}

func (x *SubscribeNotification) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type StreamMessage struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Message string `protobuf:"bytes,1,opt,name=message,proto3" json:"message,omitempty"`
}

func (x *StreamMessage) Reset() {
	*x = StreamMessage{}
	if protoimpl.UnsafeEnabled {
		mi := &file_daemon_grpc_types_subscribe_notification_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *StreamMessage) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*StreamMessage) ProtoMessage() {}

func (x *StreamMessage) ProtoReflect() protoreflect.Message {
	mi := &file_daemon_grpc_types_subscribe_notification_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use StreamMessage.ProtoReflect.Descriptor instead.
func (*StreamMessage) Descriptor() ([]byte, []int) {
	return file_daemon_grpc_types_subscribe_notification_proto_rawDescGZIP(), []int{1}
}

func (x *StreamMessage) GetMessage() string {
	if x != nil {
		return x.Message
	}
	return ""
}

var File_daemon_grpc_types_subscribe_notification_proto protoreflect.FileDescriptor

var file_daemon_grpc_types_subscribe_notification_proto_rawDesc = []byte{
	0x0a, 0x2e, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2f, 0x67, 0x72, 0x70, 0x63, 0x2f, 0x74, 0x79,
	0x70, 0x65, 0x73, 0x2f, 0x73, 0x75, 0x62, 0x73, 0x63, 0x72, 0x69, 0x62, 0x65, 0x5f, 0x6e, 0x6f,
	0x74, 0x69, 0x66, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x12, 0x05, 0x74, 0x79, 0x70, 0x65, 0x73, 0x22, 0x27, 0x0a, 0x15, 0x53, 0x75, 0x62, 0x73, 0x63,
	0x72, 0x69, 0x62, 0x65, 0x4e, 0x6f, 0x74, 0x69, 0x66, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e,
	0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64,
	0x22, 0x29, 0x0a, 0x0d, 0x53, 0x74, 0x72, 0x65, 0x61, 0x6d, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67,
	0x65, 0x12, 0x18, 0x0a, 0x07, 0x6d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x07, 0x6d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x42, 0x8b, 0x01, 0x0a, 0x2c,
	0x63, 0x6f, 0x6d, 0x2e, 0x62, 0x75, 0x6c, 0x6c, 0x65, 0x74, 0x6a, 0x6f, 0x75, 0x72, 0x6e, 0x61,
	0x6c, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x64, 0x61, 0x65, 0x6d, 0x6f,
	0x6e, 0x2e, 0x67, 0x72, 0x70, 0x63, 0x2e, 0x74, 0x79, 0x70, 0x65, 0x73, 0x42, 0x1a, 0x53, 0x75,
	0x62, 0x73, 0x63, 0x72, 0x69, 0x62, 0x65, 0x4e, 0x6f, 0x74, 0x69, 0x66, 0x69, 0x63, 0x61, 0x74,
	0x69, 0x6f, 0x6e, 0x50, 0x72, 0x6f, 0x74, 0x6f, 0x50, 0x01, 0x5a, 0x3d, 0x67, 0x69, 0x74, 0x68,
	0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x73, 0x69, 0x6e, 0x67, 0x65, 0x72, 0x64, 0x6d, 0x78,
	0x2f, 0x42, 0x75, 0x6c, 0x6c, 0x65, 0x74, 0x4a, 0x6f, 0x75, 0x72, 0x6e, 0x61, 0x6c, 0x2f, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2f, 0x67,
	0x72, 0x70, 0x63, 0x2f, 0x74, 0x79, 0x70, 0x65, 0x73, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x33,
}

var (
	file_daemon_grpc_types_subscribe_notification_proto_rawDescOnce sync.Once
	file_daemon_grpc_types_subscribe_notification_proto_rawDescData = file_daemon_grpc_types_subscribe_notification_proto_rawDesc
)

func file_daemon_grpc_types_subscribe_notification_proto_rawDescGZIP() []byte {
	file_daemon_grpc_types_subscribe_notification_proto_rawDescOnce.Do(func() {
		file_daemon_grpc_types_subscribe_notification_proto_rawDescData = protoimpl.X.CompressGZIP(file_daemon_grpc_types_subscribe_notification_proto_rawDescData)
	})
	return file_daemon_grpc_types_subscribe_notification_proto_rawDescData
}

var file_daemon_grpc_types_subscribe_notification_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_daemon_grpc_types_subscribe_notification_proto_goTypes = []interface{}{
	(*SubscribeNotification)(nil), // 0: types.SubscribeNotification
	(*StreamMessage)(nil),         // 1: types.StreamMessage
}
var file_daemon_grpc_types_subscribe_notification_proto_depIdxs = []int32{
	0, // [0:0] is the sub-list for method output_type
	0, // [0:0] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_daemon_grpc_types_subscribe_notification_proto_init() }
func file_daemon_grpc_types_subscribe_notification_proto_init() {
	if File_daemon_grpc_types_subscribe_notification_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_daemon_grpc_types_subscribe_notification_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*SubscribeNotification); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_daemon_grpc_types_subscribe_notification_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*StreamMessage); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_daemon_grpc_types_subscribe_notification_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_daemon_grpc_types_subscribe_notification_proto_goTypes,
		DependencyIndexes: file_daemon_grpc_types_subscribe_notification_proto_depIdxs,
		MessageInfos:      file_daemon_grpc_types_subscribe_notification_proto_msgTypes,
	}.Build()
	File_daemon_grpc_types_subscribe_notification_proto = out.File
	file_daemon_grpc_types_subscribe_notification_proto_rawDesc = nil
	file_daemon_grpc_types_subscribe_notification_proto_goTypes = nil
	file_daemon_grpc_types_subscribe_notification_proto_depIdxs = nil
}
