class API {

	static serialize(params) {
		var str = "";
		for (var key in params) {
		    if (str != "") {
		        str += "&";
		    }

		    if (Array.isArray(params[key])) {
		    	str += params[key].map((val) => `${key}[]=${encodeURIComponent(val)}`).join('&');
		    } else {
				str += `${key}=${encodeURIComponent(params[key])}`;
			}
		}
		return str;
	}

	static async request(url, params, opts={}) {

		let init, method = opts.method || 'GET';

		switch (method) {
			case 'POST':
				init = Object.assign({body: this.serialize(params)}, opts);
				break;

			default:
				init = opts;
				url = `${url}?${API.serialize(params)}`;
				break;
		}
	
		try {
			let res = await fetch(url, init);
			let json = await res.json();

			if (res.status == 400) {
				throw new Error(json.message || c.str.unknown_error || "");
			}


			return json;
		} catch (e) {
			throw e;
		}

		return false;
	}

	
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

	static getTeam(tournamentId, teamId) {
		let params = {
			tournamentId: tournamentId,
			teamId: teamId
		};
		return this.request('/team', params);
	}

	static getMatch(tournamentId, round, match) {
		let params = {
			tournamentId: tournamentId,
			round: round,
			match: match
		};
		return this.request('/match', params);
	}

	static getWinner(tournamentId, teamScores, matchScore) {
		let params = {
			tournamentId: tournamentId,
			teamScores: teamScores,
			matchScore: matchScore
		};
		return this.request('/winner', params);

	}

}