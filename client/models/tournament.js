class Tournament {
	
	constructor( view, numberOfTeams, teamsPerMatch ) {
		this.view = view;																// Master view
		this.numberOfTeams = numberOfTeams;												// Total number of teams
		this.teamsPerMatch = teamsPerMatch;												// Teams per match
		this.numberOfRounds = Math.log(numberOfTeams) / Math.log(teamsPerMatch);		// Compute number of rounds
		this.teams = {};																// Stored teams dictionary
	}

	/* Fetch new tournament from server, assign id and first round matches */
	async fetch() {
		let _tournament = await API.newTournament( this.numberOfTeams, this.teamsPerMatch )
		this.tournamentId = _tournament.tournamentId;
		this.matchUps = _tournament.matchUps;
	}


	async getWinner() {
		try {

			if (!this.tournamentId || !this.matchUps)	await this.fetch();

			let thisRound, winner;
			
			this.roundIndex = 0;
			//this.view.statusIndicator.state = c.state.processing;

			/* While there are more matches to process: */
			while (this.matchUps.length > 0) {
				
				thisRound = new Round( this );
				
				/* Process round, update stored teams, repeat with next round matches */
				await thisRound.process();

				this.matchUps = thisRound.nextRoundMatchUps || [];
				this.teams = thisRound.teams;

				this.roundIndex++;
			}

			/* End reached - update UI with winning team name */
			this.view.statusIndicator.state = c.state.success;
			this.view.statusIndicator.message = this.teams[thisRound.winner.teamId].name;

		} catch (error) {
			throw error;
		}
	}


}