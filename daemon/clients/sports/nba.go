package sports

import (
	"fmt"
	"github.com/buger/jsonparser"
	"github.com/go-resty/resty/v2"
	"github.com/singerdmx/BulletJournal/daemon/persistence"
	"log"
	"time"
)

type NbaClient struct {
	sampleDao *persistence.SampleTaskDao
	restClient *resty.Client
}

const (
	NbaScheduleEndpoint = "https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json"
	dateOnlyLayout      = "2006-01-02"
	timeOnlyLayout      = "3:04:05 PM"
)

func GetNbaClient(restClient *resty.Client) *NbaClient {
	return &NbaClient{
		restClient: restClient,
	}
}

func (nc *NbaClient) FetchAndStoreNbaScheduleData() {
	//Fetch data from NBA CDN
	nbaMatchScheduleData := nc.FetchNbaScheduleData(NbaScheduleEndpoint)
	//Convert the Nba MatchScheduleData to SampleTasks data
	for _, schedule := range nbaMatchScheduleData.NbaMatchSchedules {
		//Upsert the SampleTasks data based on the gameId
		nc.sampleDao.Upsert(nc.ConvertNbaScheduleToSampleTask(schedule))
	}
}

func (nc *NbaClient) ConvertNbaScheduleToSampleTask(schedule NbaMatchSchedule) *persistence.SampleTask {
	return &persistence.SampleTask{
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
		Metadata:        "SPORTS_NBA_SCHEDULE",
		Content: 		 nc.FormContentBasedOnNbaSchedule(schedule),
		Raw:             schedule.Raw,
		Name:            fmt.Sprintf("%v VS %v on %v", schedule.HomeTeamName, schedule.AwayTeamName, schedule.GameDate),
		Uid:             schedule.GameId,
		AvailableBefore: schedule.GameDate.AddDate(0, 0, 1),
		DueDate:         schedule.GameDate.String(),
		DueTime:         schedule.GameTimeEt.String(),
		Pending:         true,
		Refreshable:     true,
		TimeZone:        "America/New_York",
	}
}

func(nc *NbaClient) FormContentBasedOnNbaSchedule(schedule NbaMatchSchedule) string {
	//TODO Add logic to form schedule to required content format
	return "This is placeholder"
}

func (nc *NbaClient) FetchNbaScheduleData(scheduleEndPoint string) *NbaMatchScheduleData {
	resp, err := nc.restClient.R().Get(scheduleEndPoint)
	//Disabled logger while in dev mode
	//logger := *logging.GetLogger()
	if err != nil {
		log.Fatalf("Failed to fetch data due to: %v", err)
	}

	var res = &NbaMatchScheduleData{}
	var schedules []NbaMatchSchedule

	seasonYear, _ := jsonparser.GetString(resp.Body(), "leagueSchedule", "seasonYear")
	_, err = jsonparser.ArrayEach(resp.Body(), func(value []byte, dataType jsonparser.ValueType, offset int, err error) {
		gameStatus, err := jsonparser.GetString(value, "gameStatus")
		date, err := jsonparser.GetString(value, "gameDate")
		if err != nil || gameStatus == "3" {
			//Will not process if not able to get date or game status or game status means game finished
			return
		}
		log.Printf("Processing games for: %v\n", date)
		// TODO Filter out of the game with status of 3
		_, err = jsonparser.ArrayEach(value, func(game []byte, dataType jsonparser.ValueType, offset int, err error) {
			schedules = append(schedules, nc.ConvertRawDataToNbaMatchSchedule(seasonYear, game))
		}, "games")
		if err != nil {
			log.Fatalf("Failed to read games data for %v due to: %v\n", date, err)
		}
	}, "leagueSchedule", "gameDates")
	if err != nil {
		log.Fatalf("Failed to read schedule data from json response due to: %v", err)
	}
	res.NbaMatchSchedules = schedules
	log.Printf("There are in total %d schedules", len(schedules))
	return res
}

func (nc *NbaClient) ConvertRawDataToNbaMatchSchedule(seasonYear string, game []byte) NbaMatchSchedule {
	gameId, _ := jsonparser.GetString(game,"gameId")
	gameDateEstStr, _ := jsonparser.GetString(game,"gameDateEst")
	gameDateEst, _ := time.Parse(dateOnlyLayout, gameDateEstStr)
	gameTimeEstStr, _ := jsonparser.GetString(game,"gameTimeEst")
	gameTimeEst, _ := time.Parse(timeOnlyLayout, gameTimeEstStr)
	homeTeamName, _ := jsonparser.GetString(game,"homeTeam", "teamName")
	awayTeamName, _ := jsonparser.GetString(game,"awayTeam", "teamName")
	arenaName, _ := jsonparser.GetString(game,"arenaName")
	arenaState, _ := jsonparser.GetString(game,"arenaState")
	arenaCity, _ := jsonparser.GetString(game,"arenaCity")
	return NbaMatchSchedule{
		GameId: gameId,
		SeasonYear: seasonYear,
		GameDate: gameDateEst,
		GameTimeEt: gameTimeEst,
		HomeTeamName: homeTeamName,
		AwayTeamName: awayTeamName,
		ArenaName: arenaName,
		ArenaState: arenaState,
		ArenaCity: arenaCity,
		Raw: string(game),
	}
}