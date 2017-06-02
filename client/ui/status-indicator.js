'use strict';

class StatusIndicator extends HTMLElement {
	
	static get template() {
		return {
			hidden: s => "",
			error: s => util.str.msg.wrap_error.replace(/%s/, s),
			setup: s => util.str.msg.wrap_setup.replace(/%s/, s),
			processing: s => util.str.msg.wrap_processing.replace(/%s/, s),
			success: s => util.str.msg.wrap_winner.replace(/%s/, `<span class="${util.ids.winner}" id="${util.ids.winner}">${s}</span>`)
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

	connectedCallback() {

		this.innerHTML = "";
		this.state = util.state.hidden;
	}

}

customElements.define('status-indicator', StatusIndicator);