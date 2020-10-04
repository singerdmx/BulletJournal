package persistence

type JoinGroupInvitation struct {
	Uid            string `json:"uid"`
	Username       string `json:"username"`
	GroupId        string `json:"groupid"`
	NotificationId string `json:"notificationid"`
}

func NewJoinGroupInvitation(uid, username, groupId, notificationId string) *JoinGroupInvitation {
	return &JoinGroupInvitation{uid, username, groupId, notificationId}
}
