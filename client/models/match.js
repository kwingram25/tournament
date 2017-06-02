'use strict';

class Match {

	constructor({view, teams, tournamentId, roundIndex}, {match, teamIds}) {
		this.view = view;					// Master view
		this.teams = teams;					// Stored team dictionary
		this.tournamentId = tournamentId;	// Tournament ID
		this.roundIndex = roundIndex;		// Index of round within tournament
		this.matchIndex = match;			// Index of match within round
		this.teamIds = teamIds;				// Array of teamIds
	}

	static sortByScoreThenId(a, b) {
		if (a.score === b.score) {
			return a.teamId - b.teamId;
		}

		return a.score - b.score;
	}

	async winner() {

		try {
			/* Fetch teams in brackets of max 20, add to running dictionary once fetched */
			let bracketTeams, matchTeams = [], i = 0;
			const bracketSize = this.roundIndex === 0 ? Math.min(20, this.teamIds.length) : this.teamIds.length;
			try {
				
				while (i < this.teamIds.length) {
					bracketTeams = await Promise.all(
						this.teamIds.slice(i, i+bracketSize).map( async(teamId) => {
							if (teamId in this.teams) {
								return Promise.resolve(( ({teamId, score}) => ({teamId, score}) )(this.teams[teamId]));
							}
							
							const team = await API.getTeam(this.tournamentId, teamId);
							this.teams[teamId] = team;
							return ( ({teamId, score}) => ({teamId, score}) )(team);
						})
					);
					matchTeams = matchTeams.concat(bracketTeams);
					i += bracketSize;
				}
			} catch (error) {
				throw error;
			}


			let matchScore, matchTeamScores, winningScore;
			/* Fetch match score */
			matchScore = await API.getMatch(this.tournamentId, this.roundIndex, this.matchIndex);
			matchTeamScores = matchTeams.map(({score}) => score);

			/* Fetch match winner */
			winningScore = await API.getWinner(this.tournamentId, matchTeamScores, matchScore.score);
			
			/* Add teams with score >= victory condition to array, sort by score/lowest id, return first */
			let winningTeams = [];
			matchTeams.forEach((e) => {
				if (e.score >= winningScore.score)
					winningTeams.push(e);
			});

			winningTeams.sort(Match.sortByScoreThenId);

			/* Update UI */
			this.view.progressBar.increment(1);

			if (typeof winningTeams[0] === 'undefined') throw new Error(util.str.unknown_error);

			return winningTeams[0];
			
		} catch (error) {
			throw error;
		}
	}
}