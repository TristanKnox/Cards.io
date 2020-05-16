
class Card{

	constructor(value, suit, cardPosition){
		this.suit = suit;
		this.cardValue = value;
		this.isHidden = false;
		this.position = cardPosition;
		this.outlineColor = 'black';
		this.holdPositionOffset = {x:0, y:0}; //This reperesnts the position a player is holding the card at
		// this.width = 69;
		// this.height = 102;
	}

	getImage(){
		if(this.isHidden)
			return '/client/img/cards/red_back.png';
		return '/client/img/cards/' + this.cardValue + this.suit[0] + '.png';
	}

	setPosition(cardPosition){
		var xOffset = this.holdPositionOffset.x;
		var yOffset = this.holdPositionOffset.y;
		this.position = {x:cardPosition.x - xOffset, y:cardPosition.y - yOffset}
	}

	getPosition(){
		return this.position;
	}

	setOutlineColor(color){ this.outlineColor = color; }
	getOutlineColor(){ return this.outlineColor; }

	getCardDrawInfo(){
		return {
			img:this.getImage(),
			x:this.position.x ,
			y:this.position.y ,
			width:Card.width,
			height:Card.height,
			color:this.outlineColor
		};
	}

	isSelected(mousePos){
		var xMin = this.position.x - Card.width/2;
		var xMax = this.position.x + Card.width/2;
		var yMin = this.position.y - Card.height/2;
		var yMax = this.position.y + Card.height/2;
		if(this.isWithinRange(mousePos.x, xMin, xMax) && this.isWithinRange(mousePos.y, yMin, yMax)) {
			// this.holdPositionOffset = {x:(mousePos.x-this.position.x), y:(mousePos.y-this.position.y)};
			// this.setPosition({x:mousePos.x+10, y:mousePos.y-10});
			return true;
		}
		return false;
	}

	pickUP(mousePos){
		this.holdPositionOffset = {x:(mousePos.x-this.position.x), y:(mousePos.y-this.position.y)};
		this.setPosition({x:mousePos.x+10, y:mousePos.y-10});
	}

	putDown(){
		this.holdPositionOffset = {x:0, y:0};
		this.setPosition({x:this.position.x-10, y:this.position.y+10});
	}

	isWithinRange(value, min, max){
		return value >= min && value <= max;
	}

	toString(){
		return this.cardValue + ' of ' + this.suit + '(' + this.position.x + ',' + this.position.y + ')';
	}

}
Card.height = 105;
Card.width = 69;
module.exports = Card;