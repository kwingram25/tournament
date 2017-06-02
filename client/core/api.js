'use strict';

class API {

	/* Generate URL component for params */
	static serialize(params) {
		return Object.keys(params).map(key => {
			if (Array.isArray(params[key])) {
		    	return params[key].map((val) => `${key}[]=${encodeURIComponent(val)}`).join('&');
		    } else {
				return `${key}=${encodeURIComponent(params[key])}`;
			}

		}).join('&');
	}

	static async request(url, params={}, opts={}) {

		let _url = url, init, method = opts.method || 'GET';

		/* Pass parameters in body if POST, URL if GET */
		switch (method) {
			case 'POST':
				_url = url;
				init = Object.assign({body: this.serialize(params)}, opts);
				break;

			default:
				init = opts;
				_url = `${url}?${API.serialize(params)}`;
				break;
		}
	
		try {

			const res = await fetch(_url, init);
			const json = await res.json();

			if (!res.ok) {
				throw new Error(json.message || util.str.msg.unknown_error || "");
			}

			return json;
		} catch (error) {
			throw error;
		}

		return false;
	}

	/* POST /tournament */
	static newTournament(numberOfTeams, teamsPerMatch) {
		let params = {
			numberOfTeams: numberOfTeams,
			teamsPerMatch: teamsPerMatch
		}
		let opts = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
		
		return this.request('/tournament', params, opts);
	}

	/* GET /team */
	static getTeam(tournamentId, teamId) {
		let params = {
			tournamentId: tournamentId,
			teamId: teamId
		};
		return this.request('/team', params);
	}

	/* GET /match */
	static getMatch(tournamentId, round, match) {
		let params = {
			tournamentId: tournamentId,
			round: round,
			match: match
		};
		return this.request('/match', params);
	}

	/* GET /winner */
	static getWinner(tournamentId, teamScores, matchScore) {
		let params = {
			tournamentId: tournamentId,
			teamScores: teamScores,
			matchScore: matchScore
		};
		return this.request('/winner', params);

	}

}