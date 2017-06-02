'use strict';

class StatusIndicator extends HTMLElement {
	
	static get template() {
		return {
			hidden: s => "",
			error: s => c.str.msg.wrap_error.replace(/%s/, s),
			setup: s => c.str.msg.wrap_setup.replace(/%s/, s),
			processing: s => c.str.msg.wrap_processing.replace(/%s/, s),
			success: s => c.str.msg.wrap_winner.replace(/%s/, `<span id="${c.uiids.winner}">${s}</span>`)
		}
	}

	constructor() {
		super();
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

	update({ state = this.state, message = this.message }) {

		this.state = state;
		this.message = message;
		return this;
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