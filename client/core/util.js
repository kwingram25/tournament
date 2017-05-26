
class c {

	static get key() {
		return {
			enter : 13,
			tab : 9
		}
	}

	static get str() {
		return c.strings[navigator.language] || c.strings.en;
	}


	static get strings() {
		return {
			en: {
				app_name : "Knockout Tournament",
				teams_per_match : "Teams per match",
				number_of_teams : "Number of teams",
				number_of_rounds : "Number of rounds",
				start_button : "Start",

				msg: {
					generic : "Working",
					generating_tournament : "Generating tournament",
					processing_round : "Round %i underway",

					wrap_winner : "%s is the winner!",
					wrap_error: "<b>Error!</b> %s",
					wrap_setup: "%s",
					wrap_processing: "Round %s underway"
				}
				
			}
		}
	}


	static get uiids() {
		return {
			controls : "controls",
			display : "display",
			progress_bar : "progressBar",
			teams_per_match : "teamsPerMatch",
			number_of_teams : "numberOfTeams",
			number_of_rounds : "numberOfRounds",
			start_button : "start",
			status_message : "statusMessage",
			winner : "winner",
		}
	}

	static get state() {
		return {
			hidden: "hidden",
			setup: "setup",
			processing: "processing",
			success: "success",
			error: "error"
		}
	}
}