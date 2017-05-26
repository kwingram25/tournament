class Round {

	constructor( tournament ) {
		this.view = tournament.view;						// Master view
		this.tournamentId = tournament.tournamentId;		// Tournament ID
		this.teams = tournament.teams || {};				// Stored team dictionary
		this.roundIndex = tournament.roundIndex;			// Index of round within tournament
		this.matchUps = tournament.matchUps;				// Matches for this round
		this.teamsPerMatch = tournament.teamsPerMatch;		// Teams per match
	}

	async process() {
		var self = this;

		/* Update status message with round number; if first round defer until teams fetched */
		if (this.roundIndex > 0) {
			this.view.statusIndicator.state = c.state.processing;
			this.view.statusIndicator.message = this.roundIndex + 1;
		}

		/* Fetch winners for all matches in this round, update teams dictionary */
		let matchWinners = await Promise.all(
			this.matchUps.map( async (matchUp, matchUpIndex) => {

				let match = new Match(this, matchUpIndex, matchUp.teamIds);
				let winner = await match.winner();

				this.teams = match.teams;
				return winner;

			})
		);

		// console.log(matchWinners);

		/* If only one match this round, tournament is over - return it */
		if (matchWinners.length == 1) {
			this.winner = matchWinners[0];
			return;
		}

		/* Process winners into matchUps array for next round, pass back to Tournament */
		let nextRoundMatchUps = [];
		for (let i = 0; i < matchWinners.length; i += this.teamsPerMatch) {

			let matchUp = {
				match: i / this.teamsPerMatch,
				teamIds: matchWinners.slice(i, i + this.teamsPerMatch).map(team => team.teamId)
			}
			nextRoundMatchUps.push(matchUp);
		}

		this.nextRoundMatchUps = nextRoundMatchUps;

	}

}