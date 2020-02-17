package main

import (
	"testing"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

func TestMain(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "main")
}

var _ = Describe("parseCookie", func() {
	var (
		signed, secret string

		parsedUsername string
		parsedGroup    string
		parseError     error
	)

	JustBeforeEach(func() {
		parsedUsername, parsedGroup, parseError = parseCookie(signed, secret)
	})

	Context("when verifying with an invalid secret", func() {
		BeforeEach(func() {
			secret = "secretbar"
			signed = signCookie("user,group", "secretfoo")
		})

		It("fails", func() {
			Expect(parseError).To(HaveOccurred())
		})
	})

	Context("when verifying with an invalid payload", func() {
		BeforeEach(func() {
			secret = "mysecret"
			signed = signCookie("user,group", secret) + "garbage"
		})

		It("fails", func() {
			Expect(parseError).To(HaveOccurred())
		})
	})

	Context("when verifying with a valid payload and secret", func() {
		BeforeEach(func() {
			secret = "mysecret"
			signed = signCookie("user,group", secret)
		})

		It("returns a user and group", func() {
			Expect(parseError).To(Succeed())
			Expect(parsedUsername).To(Equal("user"))
			Expect(parsedGroup).To(Equal("group"))
		})
	})
})
