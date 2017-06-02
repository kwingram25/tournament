'use strict';

class Tournament {
	
	constructor( {statusIndicator, progressBar}, numberOfTeams=2, teamsPerMatch=2 ) {
		this.view = {										// Master view
			statusIndicator: statusIndicator,
			progressBar: progressBar
		};			
		this.numberOfTeams = numberOfTeams;					// Total number of teams
		this.teamsPerMatch = teamsPerMatch;					// Teams per match
		this.teams = {};									// Stored teams dictionary
		this.roundIndex = 0;								// Current round index
	}

	/* Fetch new tournament from server, assign id and first round matches */
	async fetch() {
		try {
			const _tournament = await API.newTournament( this.numberOfTeams, this.teamsPerMatch )
			this.tournamentId = _tournament.tournamentId;
			this.matchUps = _tournament.matchUps;

			/* If tournament valid, compute secondary properties */
			this.numberOfRounds = parseInt(Math.log(this.numberOfTeams) / Math.log(this.teamsPerMatch), 10);
			this.numberOfMatches = 1 + [...Array(this.numberOfRounds).keys()].reduce((p, c, i) => 
				p + Math.pow(this.teamsPerMatch, i)
			);

			return this;
		} catch(error) {
			throw(error);
		}
	}


	async getWinner() {
		try {

			if (!this.tournamentId || !this.matchUps)
				await this.fetch();

			let thisRound, winner;
			
			/* While there are more matches to process: */
			while (this.matchUps.length > 0) {
				
				thisRound = new Round( this );
			
				/* Process round, update stored teams, repeat with next round matches */
				await thisRound.process();

				this.matchUps = thisRound.nextRoundMatchUps || [];
				this.teams = thisRound.teams;

				this.roundIndex += 1;
			}

			/* End reached - update UI with winning team name */
			if (thisRound.winner) {
				this.view.statusIndicator.update({
					state: util.state.success,
					message: this.teams[thisRound.winner.teamId].name
				});
			} else {
				this.view.statusIndicator.update({
					state: util.state.error,
					message: util.str.msg.unknown_error
				});
			}

		} catch (error) {
			throw error;
		}
	}


}