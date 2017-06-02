
class ProgressBar extends HTMLElement {

	constructor() {
		super();

		this.connected = false;

		this.length = 0;
		this.completed = 0;
		this.hidden = true;
	}

	get template() {
		return {
			wrapper: `<ul id="${util.ids.progress_bar}"></ul>`,
			pending: `<li>`,
			completed: `<li class="complete">` 
		}
	}

	get length() {
		return parseInt(this.getAttribute('length'), 10);
	}

	set length(length) {
		this.setAttribute('length', length)
	}

	get completed() {
		return Math.min(parseInt(this.getAttribute('completed'), 10), this.length);
	}

	set completed(completed) {
		this.setAttribute('completed', Math.min(completed, this.length));
	}

	get hidden() {
		return this.getAttribute('hidden');
	}

	set hidden(hidden) {
		if (hidden) this.setAttribute('hidden', hidden);
		else this.removeAttribute('hidden');
	}

	resize(length) {
		this.length = length;
		return this;
	}

	hide() {
		this.hidden = true;
		return this;
	}

	show() {
		this.hidden = false;
		return this;
	}

	increment(n) {
		this.completed += n;
		return this;
	}

	decrement(n) {
		this.completed -= n;
		return this;
	}

	reset() {
		this.completed = 0;
		return this;
	}

	connectedCallback() {
		this.innerHTML = this.template.wrapper;

		this.$list = this.querySelector(`#${util.ids.progress_bar}`);
		this.connected = true;
	}

	static get observedAttributes() {
		return ['length', 'completed'];
	}

	attributeChangedCallback(attribute, oldValue, newValue) {

		if (!this.connected) return;

		switch (attribute) {
			case "length": 

				/* Update inner HTML with list of new length */
				if (newValue != oldValue) {

					this.connected = false;
					this.completed = Math.min(this.completed, newValue);
					this.connected = true;

					this.$list.innerHTML = this.template.completed.repeat(this.completed) + 
											this.template.pending.repeat(newValue - this.completed);
				}
			
				break;

			case "completed":
				const o = parseInt(oldValue, 10);
				const n = Math.min(this.length, parseInt(newValue, 10));

				/* Toggle "complete" class for blocks in range between old and new */
				[...Array(Math.abs(n - o)).keys()].map(i => 1 + i + Math.min(n, o)).forEach((index) => {
					this.querySelector(`li:nth-child(${index})`).classList.toggle('complete');
				});
				break;

			default:
				break;

		}

	}

}

customElements.define('progress-bar', ProgressBar);