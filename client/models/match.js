class Match {

	constructor({view, teams, tournamentId, roundIndex}, matchIndex, teamIds) {
		this.view = view;					// Master view
		this.teams = teams;					// Stored team dictionary
		this.tournamentId = tournamentId;	// Tournament ID
		this.roundIndex = roundIndex;		// Index of round within tournament
		this.matchIndex = matchIndex;		// Index of match within round
		this.teamIds = teamIds;				// Array of teamIds
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
		
		/* All teams in memory - if first round, update UI to start showing match progress */
		if (this.roundIndex == 0) {
			this.view.statusIndicator.update({
				state: "processing",
				message: this.roundIndex + 1
			});

			this.view.progressBar.show();
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