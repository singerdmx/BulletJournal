package persistence

type EtagType int

//Specific constant definition for EtagType
const (
	NotificationType EtagType = iota
	GroupType
	UserGroupType
	NotificationDeleteType
	GroupDeleteType
)

type Etag struct {
	Index string `json:"index"`
	Etag  string `json:"etag"`
}

func (et EtagType) String() string {
	return [...]string{"Notification", "Group", "UserGroups", "NotificationDelete", "GroupDelete"}[et]
}

func GenerateEtag(username string, eType EtagType, etag string) *Etag {
	index := username + "@" + eType.String()
	return &Etag{index, etag}
}

func NewEtag(username string, eTypeStr string, etag string) *Etag {
	index := username + "@" + eTypeStr
	return &Etag{index, etag}
}
