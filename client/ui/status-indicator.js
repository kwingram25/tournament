'use strict';

class StatusIndicator extends HTMLElement {
	
	static get template() {
		return {
			hidden: s => "",
			error: s => c.str.msg.wrap_error.replace(/%s/, s),
			setup: s => c.str.msg.wrap_setup.replace(/%s/, s),
			processing: s => c.str.msg.wrap_processing.replace(/%s/, s),
			success: w => c.str.msg.wrap_winner.replace(/%s/, `<span id="${c.uiids.winner}">${w}</span>`)
		}
	}

	get state() {
		return this.getAttribute("state");
	}

	set state(state) {
		this.setAttribute("state", state);
	}

	set message(message) {
		this.innerHTML = `<div>${StatusIndicator.template[this.state](message)}</div>`;
	}

	constructor() {
		super();
	}

	createdCallback() {

	}

	connectedCallback() {

		this.innerHTML = "";
		this.state = c.state.hidden;
	}

	createdCallback() {


	}

}

customElements.define('status-indicator', StatusIndicator);