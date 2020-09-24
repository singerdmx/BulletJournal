package main

import "fmt"

func main()  {
	earningClient, err := NewEarningsClient()
	if err != nil {
		fmt.Println(err)
	}
	earningClient.fetchEarnings()
}