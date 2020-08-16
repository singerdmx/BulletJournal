package clients

import (
	"fmt"
	"github.com/mailjet/mailjet-apiv3-go"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"log"
	"os"
	"strconv"
)

type Group struct {
	Id    uint64
	Name  string
	Owner string
}

const (
	ACCEPT  string = "accept"
	DECLINE string = "decline"
)

func GetUrl(uuid uint64, action string) string {
	return "https://bulletjournal.us/public/notifications/" + strconv.FormatUint(uuid, 10) + "/answer?action=" + action
}

// Send join group invitation email to users
func SendJoinGroupEmail(username, email string, groupId, notificationId uint64) {
	g := Group{groupId, "g1", "X"} // TODO: query group from db
	acceptUrl := GetUrl(notificationId, ACCEPT)
	declineUrl := GetUrl(notificationId, DECLINE)
	serviceConfig := *config.GetConfig()
	mailjetClient := mailjet.NewMailjetClient(os.Getenv(serviceConfig.ApiKeyPublic), os.Getenv(serviceConfig.ApiKeyPrivate))
	messagesInfo := []mailjet.InfoMessagesV31{
		{
			From: &mailjet.RecipientV31{
				Email: "bulletjournal1024@hotmail.com",
				Name:  "Bullet Journal",
			},
			To: &mailjet.RecipientsV31{
				mailjet.RecipientV31{
					Email: email,
					Name:  username,
				},
			},
			Subject:  "You are invited to Group " + g.Name + " by " + g.Owner,
			TextPart: "Dear " + username + ",",
			HTMLPart: "<a href=\"" + acceptUrl + "\">Accept</a><br /><a href=\"" + declineUrl + "\">Decline</a>",
		},
	}
	messages := mailjet.MessagesV31{Info: messagesInfo}
	res, err := mailjetClient.SendMailV31(&messages)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Data: %+v\n", res)
}
