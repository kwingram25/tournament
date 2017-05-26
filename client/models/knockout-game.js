'use strict';

class KnockoutGame {
	
	constructor( selector ) {

		this.view = new KnockoutGameView();
		document.querySelector(selector).appendChild(this.view);
	}

}