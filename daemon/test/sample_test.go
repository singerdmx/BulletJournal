package main

import (
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"testing"
)

/*
  Test objects
*/

// MyMockedObject is a mocked object that implements an interface
// that describes an object that the code I am testing relies on.
type MyMockedObject struct {
	mock.Mock

	name string
}

// DoSomething is a method on MyMockedObject that implements some interface
// and just records the activity, and returns what the Mock object tells it to.
//
// In the real object, this method would do something useful, but since this
// is a mocked object - we're just going to stub it out.
//
// NOTE: This method is not being tested here, code that uses this object is.
func (m *MyMockedObject) DoSomething(number int) (bool, error) {

	args := m.Called(number)
	return args.Bool(0), args.Error(1)

}

/*
  Actual test functions
*/

// TestSomething is an example of how to use our test object to
// make assertions about some target code we are testing.
func TestSomething(t *testing.T) {

	// create an instance of our test object
	testObj := new(MyMockedObject)

	// setup expectations
	testObj.On("DoSomething", 123).Return(true, nil)

	// call the code we are testing
	targetFuncThatDoesSomethingWithObj(testObj)

	// assert that the expectations were met
	// testObj.AssertExpectations(t)
	assert.NotNil(t, testObj)
}

// TestSomethingElse is a second example of how to use our test object to
// make assertions about some target code we are testing.
// This time using a placeholder. Placeholders might be used when the
// data being passed in is normally dynamically generated and cannot be
// predicted beforehand (eg. containing hashes that are time sensitive)
func TestSomethingElse(t *testing.T) {

	// create an instance of our test object
	testObj := new(MyMockedObject)

	// setup expectations with a placeholder in the argument list
	testObj.On("DoSomething", mock.Anything).Return(true, nil)

	// call the code we are testing
	targetFuncThatDoesSomethingWithObj(testObj)

	// assert that the expectations were met
	// testObj.AssertExpectations(t)
	assert.NotNil(t, testObj)
}

func targetFuncThatDoesSomethingWithObj(testObj *MyMockedObject) {
	return
}

func TestSample(t *testing.T) {
	assert := assert.New(t)

	assert.Equal(1, 1, "value match")
}
