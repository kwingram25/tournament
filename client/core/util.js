'use strict';

class util {

	/* Get string dictionary for user language / English */
	static get str() {
		return util.strings[navigator.language] || util.strings.en;
	}

	/* App strings */
	static get strings() {
		return {
			"en-US" : {
				app_name : "Knockout Tournament",
				teams_per_match : "Teams per match",
				number_of_teams : "Number of teams",
				number_of_rounds : "Number of rounds",
				start_button : "Start",

				msg: {
					generic : "Working",
					generating_tournament : "Generating tournament",
					processing_round : "Round %i underway",
					unknown_error : "Unknown error",

					wrap_winner : "%s is the winner!",
					wrap_error: "<b>Error!</b> %s",
					wrap_setup: "%s",
					wrap_processing: "Round %s underway"
				}
				
			}
		}
	}

	/* UI element ID's */
	static get ids() {
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

	/* Tournament states */
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