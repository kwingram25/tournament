'use strict';

class KnockoutGameView extends HTMLElement {
	
	constructor() {
		super();
	}

	connectedCallback() {

		/* Append HTML */
		const
			input = (field, attrs) => {
				const attributes = Object.keys(attrs).map(k => `${k}="${attrs[k]}"`).join(' ');
				return `
					<div class="input">
						<label for="${util.ids[field]}">${util.str[field]}</label>
						<input id="${util.ids[field]}" ${attributes}/>
					</div>
				`
			},
			button = (field) => `
				<button type="submit" id="${util.ids[field]}">${util.str[field]}</button>
			`;
			

		this.innerHTML = `
			<form id="${util.ids.controls}" class="${util.ids.controls}">
				<h1>${util.str.app_name}</h1>
				${input("teams_per_match", {
					min: 2,
					max: 998,
					type: "number"
				})}
				${input("number_of_teams", {
					min: 2,
					type: "number"
				})}
			    ${button`start_button`}
			</form>
			<div id="${util.ids.display}" class="${util.ids.display}">
			</div>
		`;

		/* Connect controls and display logic */
		this.buildControls();
		this.buildDisplay();
	}

	get numberOfTeams() {
		return parseInt(this.querySelector(`#${util.ids.number_of_teams}`).value, 10);
	}

	get teamsPerMatch() {
		return parseInt(this.querySelector(`#${util.ids.teams_per_match}`).value, 10);
	}

	get locked() {
		return this.$startButton.hasAttribute('disabled');
	}

	set locked(locked) {
		if (locked) 
			this.$startButton.setAttribute('disabled', 'true');
		else 
			this.$startButton.removeAttribute('disabled');
	}

	buildControls() {
		this.$controls = this.querySelector(`#${util.ids.controls}`);
		this.$teamsPerMatch = this.querySelector(`#${util.ids.teams_per_match}`);
		this.$numberOfTeams = this.querySelector(`#${util.ids.number_of_teams}`);
		this.$startButton = this.querySelector(`#${util.ids.start_button}`);

		this.$controls.addEventListener("submit", (e) => {
			e.preventDefault();

			if (!this.locked)
				this.runNewTournament();
		});

	}

	buildDisplay() {
		this.$display = this.querySelector(`#${util.ids.display}`);

		this.statusIndicator = new StatusIndicator();
		this.$display.appendChild(this.statusIndicator);

		this.progressBar = new ProgressBar();
		this.$display.appendChild( this.progressBar );

	}


	async runNewTournament() {

		/* Lock interaction while running */
		this.locked = true;

		/* Recycle / update leftover UI elements */
		if (this.statusIndicator) 
			this.statusIndicator.update({
				state: util.state.setup,
				message: util.str.msg.generating_tournament
			});
		

		if (this.progressBar) 
			this.progressBar.reset().resize(0).hide();
		

		/* Create and append progress bar, begin tournament run */
		try {

			let tournament = new Tournament( this, this.numberOfTeams, this.teamsPerMatch );
			await tournament.fetch();

			this.progressBar.resize( tournament.numberOfMatches ).reset();
			await tournament.getWinner();

		}
		catch ( error ) {
			/* Catch error during execution, display in status indicator */
			console.error(error);
			this.statusIndicator.update({
				state: util.state.error,
				message: error.message || c.str.msg.unknown_error
			});
		}

		this.locked = false;

	}


}

customElements.define('knockout-game', KnockoutGameView);