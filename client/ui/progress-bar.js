
class ProgressBar extends HTMLElement {

	constructor( numberOfRounds, teamsPerMatch ) {
		super();

		this.connected = false;
		this.teamsPerMatch = teamsPerMatch || 0;
		this.numberOfRounds = numberOfRounds || 0;

		this.matchesCompleted = 0;
		this.hidden = true;

	}

	static get observedAttributes() {
		return ['matches-completed'];
	}

	get matchesCompleted() {
		return parseInt(this.getAttribute('matches-completed'), 10);
	}

	set matchesCompleted(n) {
		this.setAttribute('matches-completed', n);
	}

	get hidden() {
		return this.getAttribute('hidden');
	}

	set hidden(hidden) {
		if (hidden) this.setAttribute('hidden', hidden);
		else this.removeAttribute('hidden');
	}

	get numberOfMatches() {
		console.log(this.numberOfRounds);
		let n = 1 + [...Array(this.numberOfRounds).keys()].reduce((p, c, i) => p + Math.pow(this.teamsPerMatch, i));
		return n;
	}

	get winner() {
		return this.getAttribute('winner');
	}

	set winner(s) {
		this.querySelector(`#${c.uiids.status_message}`).innerHTML = s;
	}

	connectedCallback() {
		console.log('connected');
		this.innerHTML = `<ul id="${c.uiids.progress_bar}"></ul>`
		this.matchesCompleted = 0;

		let $progressList = this.querySelector(`#${c.uiids.progress_bar}`);


		[...Array(this.numberOfMatches).keys()].map(i => {

			$progressList.innerHTML += `
				<li${i >= this.matchesCompleted ? "" : ' class="complete"'}>
			`
		});

		this.connected = true;

	}

	attributeChangedCallback(attribute, oldValue, newValue) {

		if (!this.connected) return;


		if (attribute === "matches-completed") {

			if (this.hidden) this.hidden = false;

			const o = parseInt(oldValue, 10);
			const n = parseInt(newValue, 10);

			/* Toggle complete class for blocks in range between old and new */
			[...Array(Math.abs(n - o)).keys()].map(i => 1 + i + Math.min(n, o)).forEach((e, i) => {
				this.querySelector(`li:nth-child(${e})`).classList.toggle('complete');
			});

		}
	}

	increment(n) {
		this.matchesCompleted += n;
	}

	decrement(n) {
		this.matchesCompleted -= n;
	}
}

customElements.define('progress-bar', ProgressBar);