

class Player{

	// static playerNumber = 0;

	constructor(id, name){
		this.id = id;
		this.name = name;
		this.mousePostion = {x:0, y:0};
		this.color = Player.color[Player.number++];
		this.x = 0;
		this.y = 0;
		this.cardHeld = null;
	}

	setCardHeld(card){
		if(card != null)
			card.pickUP(this.mousePostion);
		this.cardHeld = card;
	}
	getCardHeld(){ return this.cardHeld; }
	getPlayerColor(){ return this.color; }
	setMousePostion(x, y){
		this.mousePostion = {x:x, y:y};
		if(this.isHoldingCard()) {
			this.cardHeld.setPosition(this.mousePostion)
			// console.log("moving card position: (" + this.mousePostion.x + ',' + this.mousePostion.y + ')')
		}
	}
	getMousePostion(){ return this.mousePostion; }

	isHoldingCard(){
		if(this.cardHeld === null)
			return false;
		return true;
	}
}
Player.number = 0;
Player.color = ['red', 'green', 'purple', 'orange', 'yellow'];
module.exports = Player;

