package persistence

type JoinGroupResponse struct {
	Uid    string `json:"uid"`
	Username string `json:"username"`
}

func NewJoinGroupResponse(uid string, username string) *JoinGroupResponse {
	return &JoinGroupResponse{uid, username}
}
