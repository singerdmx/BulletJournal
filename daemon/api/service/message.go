package service

import (
	"context"

	"github.com/mailjet/mailjet-apiv3-go"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
	"github.com/singerdmx/BulletJournal/daemon/utils"
)

const (
	Accept  = "accept"
	Decline = "decline"
)

var ctx = context.Background()

type MessageService struct {
	groupDao               *persistence.GroupDao
	joinGroupInvitationDao *persistence.JoinGroupInvitationDao
	mailClient             *mailjet.Client
}

func NewMessageService(
	groupDao *persistence.GroupDao,
	joinGroupInvitationDao *persistence.JoinGroupInvitationDao,
	mailClient *mailjet.Client) *MessageService {
	return &MessageService{groupDao, joinGroupInvitationDao, mailClient}
}

func GetUrl(uuid string, action string) string {
	return "https://bulletjournal.us/public/notifications/" + uuid + "/answer?action=" + action
}

// Send join group invitation email to users
func (m *MessageService) SendJoinGroupEmail(username, email string, groupId, uid uint64) {
	notificationId := utils.GenerateUID()
	// Set in redis with key of uid and value of JoinGroupInvitation json string
	m.joinGroupInvitationDao.SingleCache(
		&persistence.JoinGroupInvitation{string(uid), username, string(groupId), notificationId})

	group := m.groupDao.FindGroup(groupId)
	if group == nil {
		log.Fatalf("cannot find group with group id %v", groupId)
		return
	}
	acceptUrl := GetUrl(notificationId, Accept)
	declineUrl := GetUrl(notificationId, Decline)

	messagesInfo := []mailjet.InfoMessagesV31{
		{
			From: &mailjet.RecipientV31{
				Email: "bulletjournal1024@outlook.com",
				Name:  "Bullet Journal",
			},
			To: &mailjet.RecipientsV31{
				mailjet.RecipientV31{
					Email: email,
					Name:  username,
				},
			},
			Subject:  "You are invited to Group " + group.Name + " by " + group.Owner,
			TextPart: "Dear " + username + ",",
			HTMLPart: "Welcome to BulletJournal!\n\nClick the following link to confirm and activate your new account:\n<a href=\"" + acceptUrl + "\">Accept</a><br /><a href=\"" + declineUrl + "\">Decline</a>\n\nIf the above link is not clickable, try copying and pasting it into the address bar of your web browser.",
		},
	}

	messages := mailjet.MessagesV31{Info: messagesInfo}
	if client, err := persistence.GetMailClient(); err != nil {
		log.Fatal(err)
	} else {
		if res, err := client.SendMailV31(&messages); err != nil {
			log.Fatal(err)
		} else {
			log.Printf("Data: %+v\n", res)
		}
	}
}
