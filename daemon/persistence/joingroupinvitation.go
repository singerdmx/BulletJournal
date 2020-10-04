package persistence

type JoinGroupInvitation struct {
	Uid      string `json:"uid"`
	Username string `json:"username"`
}

func NewJoinGroupInvitation(uid string, username string) *JoinGroupInvitation {
	return &JoinGroupInvitation{uid, username}
}
