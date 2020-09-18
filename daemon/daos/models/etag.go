package models

type EtagType int

//Spefic constant definition for EtagType
const (
	NOTIFICATION        EtagType = iota
	GROUP               EtagType = iota
	USER_GROUP          EtagType = iota
	NOTIFICATION_DELETE EtagType = iota
	GROUP_DELETE        EtagType = iota
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
