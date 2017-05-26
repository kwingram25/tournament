class Match {

	constructor(round, matchIndex, teamIds) {
		this.view = round.view;						// Master view
		this.teams = round.teams;					// Stored team dictionary
		this.tournamentId = round.tournamentId;		// Tournament ID
		this.roundIndex = round.roundIndex;			// Index of round within tournament
		this.matchIndex = matchIndex;				// Index of match within round
		this.teamIds = teamIds;						// Array of teamIds
	}

	static sortByScoreThenId(a, b) {
		if (a.score === b.score) {
			return a.teamId - b.teamId;
		}

		return a.score - b.score;
	}

	async winner() {

		/* Fetch or look up stored teams in this match by ID */
		let matchTeams = await Promise.all(
			this.teamIds.map( async(teamId) => {
				if (teamId in this.teams) {
					// console.log('found in memory');
					return Promise.resolve(( ({teamId, score}) => ({teamId, score}) )(this.teams[teamId]));
				}
				
				let team = await API.getTeam(this.tournamentId, teamId);
				this.teams[teamId] = team;
				return (( ({teamId, score}) => ({teamId, score}) ))(team);
			})
		);


		/* Fetch match score */
		let matchScore = await API.getMatch(this.tournamentId, this.roundIndex, this.matchIndex);
		let matchTeamScores = matchTeams.map(({score}) => score);

		/* Fetch match winner */
		let winningScore = await API.getWinner(this.tournamentId, matchTeamScores, matchScore.score);
		
		/* All teams in memory - if first round, update UI to add match progress */
		if (this.roundIndex == 0) {
			this.view.statusIndicator.state = c.state.processing;
			this.view.statusIndicator.message = this.roundIndex + 1;
			this.view.progressBar.hidden = false;
		}

		/* Add teams with score >= victory condition to array, sort by score/lowest id, return first */
		let winningTeams = [];
		matchTeams.forEach((e, i, a) => {
			if (e.score >= winningScore.score)
				winningTeams.push(e);
		})

		winningTeams.sort(Match.sortByScoreThenId);

		/* Update UI */
		this.view.progressBar.increment(1);

		return winningTeams[0];
	}
}