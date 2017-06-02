class Tournament {
	
	constructor( {statusIndicator, progressBar}, numberOfTeams=2, teamsPerMatch=2 ) {
		this.view = {										// Master view
			statusIndicator: statusIndicator,
			progressBar: progressBar
		};			
		this.numberOfTeams = numberOfTeams;					// Total number of teams
		this.teamsPerMatch = teamsPerMatch;					// Teams per match
		this.teams = {};									// Stored teams dictionary
	}

	/* Fetch new tournament from server, assign id and first round matches */
	async fetch() {
		const _tournament = await API.newTournament( this.numberOfTeams, this.teamsPerMatch )
		this.tournamentId = _tournament.tournamentId;
		this.matchUps = _tournament.matchUps;

		/* If tournament valid, compute secondary properties */
		this.numberOfRounds = parseInt(Math.log(this.numberOfTeams) / Math.log(this.teamsPerMatch), 10);
		this.numberOfMatches = 1 + [...Array(this.numberOfRounds).keys()].reduce((p, c, i) => 
			p + Math.pow(this.teamsPerMatch, i)
		);

	}


	async getWinner() {
		try {

			if (!this.tournamentId || !this.matchUps)
				await this.fetch();

			let thisRound, winner;
			
			this.roundIndex = 0;

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
			this.view.statusIndicator.update({
				state: "success",
				message: this.teams[thisRound.winner.teamId].name
			})

		} catch (error) {
			throw error;
		}
	}


}