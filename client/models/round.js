'use strict';

class Round {

	constructor({ view, tournamentId, roundIndex, matchUps, teamsPerMatch, teams={} }) {
		this.view = view;						// Master view
		this.tournamentId = tournamentId;		// Tournament ID
		this.teams = teams;						// Stored team dictionary
		this.roundIndex = roundIndex;			// Index of round within tournament
		this.matchUps = matchUps;				// Matches for this round
		this.teamsPerMatch = teamsPerMatch;		// Teams per match
	}

	async process() {
		try {

			/* Update status message with round number */
			this.view.statusIndicator.update({
				state: util.state.processing,
				message: this.roundIndex + 1
			});
			if (this.view.progressBar.hidden)
				this.view.progressBar.show();

			/* Break matchUps into segments so no more than 15 teams fetched at once */

			let matchWinners = [], i = 0;
			const matchesPerSegment = this.roundIndex === 0 ? Math.max(1, Math.floor(15 / this.teamsPerMatch)-1) : this.matchUps.length;

			try {
				while (i < this.matchUps.length) {
					let segmentWinners = await Promise.all(
						this.matchUps.slice(i, i+matchesPerSegment).map( async (matchUp) => {

							const match = new Match(this, matchUp);
							const winner = await match.winner();

							this.teams = match.teams;
							return winner;

						})
					);

					matchWinners = matchWinners.concat(segmentWinners);

					i += matchesPerSegment;
				}
			} catch(error) {
				//throw error;
			}

			/* If only one match this round, tournament is over - return it */
			if (matchWinners.length == 1) {
				this.winner = matchWinners[0];
				return;
			}

			/* Process winners into matchUps array for next round, pass back to Tournament */
			let nextRoundMatchUps = [];
			for (let i = 0; i < matchWinners.length; i += this.teamsPerMatch) {

				const matchUp = {
					match: i / this.teamsPerMatch,
					teamIds: matchWinners.slice(i, i + this.teamsPerMatch).map(team => team.teamId)
				}
				nextRoundMatchUps.push(matchUp);
			}

			this.nextRoundMatchUps = nextRoundMatchUps;

		} catch(error) {
			throw error;
		}

	}

}