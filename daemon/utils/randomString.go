package utils

import (
	"math/rand"
	"time"
)

const (
	// Character set used for output string
	charset = "abcdefghijklmnopqrstuvwxyz" +
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	// Fixed length of output string
	stringLength = 9
)

var seededRand *rand.Rand = rand.New(
	rand.NewSource(time.Now().UnixNano()))

// RandomString produces a string made by characters from 'CHARSET' with
// 'STRING_LENGTH' length.
func RandomString() string {
	result := make([]byte, stringLength)
	for index := range result {
		result[index] = charset[seededRand.Intn(len(charset))]
	}
	return string(result)
}
