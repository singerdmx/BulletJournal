package service

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/mailjet/mailjet-apiv3-go"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
)

const (
	Accept  = "accept"
	Decline = "decline"
	UIDTTL  = 86400000 * time.Millisecond
)

var ctx = context.Background()

type MessageService struct {
	groupDao   *persistence.GroupDao
	mailClient *persistence.MailjetClient
}

func GetUrl(uuid uint64, action string) string {
	return "https://bulletjournal.us/public/notifications/" + strconv.FormatUint(uuid, 10) + "/answer?action=" + action
}

// Send join group invitation email to users
func (m *MessageService) SendJoinGroupEmail(username, email string, groupId, uid uint64) {
	//Set in redis with key of uid and value of username
	rdb := persistence.GetRedisClient(config.GetConfig())
	err := rdb.Set(ctx, fmt.Sprint(uid), username+"@"+fmt.Sprint(groupId), UIDTTL).Err()
	if err != nil {
		log.Fatalf("failed to persist username to redis %v", username)
	}

	group := persistence.GetGroupDao().FindGroup(groupId)
	if group == nil {
		log.Fatalf("cannot find group with group id %v", groupId)
		return
	}
	acceptUrl := GetUrl(uid, Accept)
	declineUrl := GetUrl(uid, Decline)

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
