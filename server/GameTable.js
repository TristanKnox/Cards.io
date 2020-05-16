
class GameTable{
	
	constructor(){
		this.players = [];
		// this.deck
		this.cardsInPlay = [];
	}

	putCardOnTable(card){

		this.cardsInPlay.push(card);
	}

	getCardsOnTable(){
		return this.cardsInPlay;
	}

	addPlayer(player){
		this.players.push(player);
	}

	getCardsOnTableDrawInfo(){
		var cardsDrawInfo = [];
		for(var i = 0; i < this.cardsInPlay.length; i++){
			var card = this.cardsInPlay[i];
			var info = card.getCardDrawInfo();//{img:card.getImage(), x:card.getPosition().x , y:card.getPosition().y };
			cardsDrawInfo.push(info);
		}
		return cardsDrawInfo;
	}

	getCardsInMotionInfo(){
		var cardsInMotion = [];
		for(var i = 0; i < this.players.length; i++){
			var player = this.players[i];
			if(player.isHoldingCard()) {
				var card = player.getCardHeld();
				cardsInMotion.push(card.getCardDrawInfo());
			}
		}
		return cardsInMotion;
	}

	grabCardOffTable(player, mousePos){
		for(var i = 0; i < this.cardsInPlay.length; i++){
			var card = this.cardsInPlay[i];
			if(card.isSelected(mousePos)){
				// player.setCardHeld(card);
				this.cardsInPlay.splice(i,1);
				return  card;
			}
		}
		return null
	}
}

module.exports = GameTable;