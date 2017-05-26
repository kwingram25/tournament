'use strict';

class KnockoutGameView extends HTMLElement {
	
	constructor() {
		super();
	}

	connectedCallback() {

		/* Append HTML */
		const
			input = (field, min) => `
				<div class="input">
					<label for="${c.uiids[field]}">${c.str[field]}</label>
					<input id="${c.uiids[field]}" min="${min}" type="number" />
				</div>
			`,
			button = (field) => `
				<button type="submit" id="${c.uiids[field]}">${c.str[field]}</button>
			`;
			

		this.innerHTML = `
			<form id="${c.uiids.controls}" class="${c.uiids.controls}">
				<h1>${c.str.app_name}</h1>
				${input("teams_per_match", 2)}
				${input("number_of_teams", 2)}
			    ${button`start_button`}
			</form>
			<div id="${c.uiids.display}" class="${c.uiids.display}">
			</div>
		`;

		/* Connect controls and display logic */
		this.buildControls();
		this.buildDisplay();
	}

	get numberOfTeams() {
		return parseInt(this.querySelector(`#${c.uiids.number_of_teams}`).value, 10);
	}

	get teamsPerMatch() {
		return parseInt(this.querySelector(`#${c.uiids.teams_per_match}`).value, 10);
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
		this.$controls = this.querySelector(`#${c.uiids.controls}`);
		this.$teamsPerMatch = this.querySelector(`#${c.uiids.teams_per_match}`);
		this.$numberOfTeams = this.querySelector(`#${c.uiids.number_of_teams}`);
		this.$startButton = this.querySelector(`#${c.uiids.start_button}`);


		const didClickNumberInput = (e) => {
			setTimeout(e.target.select(), 0);
		};

		const didEditNumberInput = (e) => {
			let newValue = e.target.value;
			e.target.setAttribute("value", newValue);
		};

		[this.$teamsPerMatch, this.$numberOfTeams].forEach((o) => {
			o.addEventListener("click", didClickNumberInput);
		});

		this.$controls.addEventListener("submit", (e) => {
			e.preventDefault();

			if (!this.locked)
				this.runNewTournament();
		});

	}

	buildDisplay() {
		this.$display = this.querySelector(`#${c.uiids.display}`);

		this.statusIndicator = new StatusIndicator();
		this.$display.appendChild(this.statusIndicator);
	}


	async runNewTournament() {

		/* Lock interaction while running */
		this.locked = true;

		/* Recycle / update leftover UI elements */
		if (this.progressBar) {
			this.progressBar.remove();
		}

		if (this.statusIndicator) {
			this.statusIndicator.state = c.state.setup;
			this.statusIndicator.message = c.str.msg.generating_tournament;
		}

		/* Create and append progress bar, begin tournament run */
		try {

			let tournament = new Tournament( this, this.numberOfTeams, this.teamsPerMatch );
			
			await tournament.fetch();
			
			this.progressBar = new ProgressBar( tournament.numberOfRounds, tournament.teamsPerMatch );
			this.$display.appendChild( this.progressBar );

			await tournament.getWinner();


		}
		catch ( error ) {
			/* Catch error during execution, display in status indicator */
			console.error(error);
			this.statusIndicator.state = c.state.error;
			this.statusIndicator.message = error.message;
		}

		this.locked = false;

	}


}

customElements.define('knockout-game', KnockoutGameView);