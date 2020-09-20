package persistence

import (
	"fmt"
	"github.com/mailjet/mailjet-apiv3-go"
	"github.com/singerdmx/BulletJournal/daemon/config"
	"github.com/singerdmx/BulletJournal/daemon/logging"
	"os"
)

type MailjetClient struct {
	client *mailjet.Client
	log    logging.Logger
}

var mailjetClient MailjetClient

func (m *MailjetClient) SetLogger() {
	m.log = *logging.GetLogger()
}

func (m *MailjetClient) SetMailjetClient(publicKey string, privateKey string) {
	m.client = mailjet.NewMailjetClient(publicKey, privateKey)
	if m.client == nil {
		m.log.Errorf("failed to set mailjet client")
	}
}

func (m *MailjetClient) NewClient() {
	serviceConfig := *config.GetConfig()
	mailjetClient.SetLogger()
	mailjetClient.SetMailjetClient(os.Getenv(serviceConfig.ApiKeyPublic), os.Getenv(serviceConfig.ApiKeyPrivate))
}

func GetMailClient() (*mailjet.Client, error) {
	if mailjetClient.client == nil {
		mailjetClient.NewClient()
		if mailjetClient.client == nil {
			mailjetClient.log.Errorf("failed to get mailjet client")
			return nil, &MailjetClientError{}
		}
	}
	return mailjetClient.client, nil
}

type MailjetClientError struct {}

func (e *MailjetClientError) Error() string {
	return fmt.Sprintf("mailjet client retrival error")
}