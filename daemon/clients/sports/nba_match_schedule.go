package sports

import "time"

type NbaMatchScheduleData struct {
	NbaMatchSchedules []NbaMatchSchedule `json:"nba_match_schedule_data"`
}

// Serializer for Dividends response
type NbaMatchSchedule struct {
	GameId 		   string `json:"game_id"`
	SeasonYear     string `json:"season_year"`
	GameDate       time.Time `json:"game_date"`
	GameTimeEt     time.Time `json:"game_time_et"`
	HomeTeamName   string `json:"home_team_name"`
	AwayTeamName   string `json:"way_away_team_name"`
	ArenaName      string `json:"arena_name"`
	ArenaState     string `json:"arena_state"`
	ArenaCity      string `json:"arena_city"`
	Raw     	   string `json:"raw"`
}