
var DEBUG = true;
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var http = require('http'), fs = require('fs'),
Canvas = require('canvas');

//Local Moduals
var Player = require('./server/player.js');
var GameTable = require('./server/GameTable.js');
var Card = require('./server/Card.js');

// import  {Player} from './server/player.js';

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(3000);
console.log("Server Started")

//Lists of socket/player connections
var SOCKET_LIST = {};
var PLAYER_LIST = {};

var table = new GameTable();
table.putCardOnTable(new Card(2, 'Clubs', {x: 50, y: 100}));
table.putCardOnTable(new Card('A', 'Hearts', {x: 170, y: 200}));
var cardTest = new Card(3, 'Clubs', {x:160, y:220});
console.log(cardTest.getImage());

//Connections handeler function
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	var player = new Player(socket.id, 'Tristan');
	table.addPlayer(player);
	PLAYER_LIST[socket.id] = player;


	//Handel disconnect
	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});

	socket.on('chatInput',function (data) {
		var playerName = player.getName();
		var playerColor = player.getPlayerColor();
		var chatPacket = {name:playerName, msg:data, color:playerColor}
		broacast('addToChat',chatPacket)
	});

	socket.on('eval',function(data){
		if(!DEBUG)
			return;
		console.log('eval request:' + data);
		var res = eval(data);
		console.log(res);
		socket.emit('evalResponse', res);
	});

	socket.on('mouseDown', function(data){

		pos = '(' + data.pos.x + ',' + data.pos.y  + ')';
		if(data.state) {
			card = table.grabCardOffTable(player, data.pos);
			player.setCardHeld(card)
			// console.log(player.id + ' Mouse ' + data.inputId + ' Down: ' + pos);
		}
		else {
			if(player.isHoldingCard()){
				var card = player.getCardHeld();
				card.setOutlineColor(player.getPlayerColor());
				card.putDown();
				table.putCardOnTable(card);
				player.setCardHeld(null);
			}
			// console.log('Mouse ' + data.inputId + ' Up: ' + pos)
		}
	});

	socket.on('mouseMove', function(data){
		player.setMousePostion(data.x, data.y);
		// pos = '(' + data.x + ',' + data.y  + ')';
		// console.log('Mouse move: ' + pos)
	})
});

//Game loop
setInterval(function(){
	var playrPacket = [];
	//For every player connection add info to packet
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];
		player.x++;
		player.y++;
		imgSrc = '/client/img/cards/2H.png';
		playrPacket.push({
			x:player.x,
			y:player.y,
			name:player.name,
			imgSrc:imgSrc,
		})
	}


	var cardsToDraw = table.getCardsOnTableDrawInfo();
	var cardsInMotion = table.getCardsInMotionInfo();
	// console.log('Cards in motion');
	// console.log(cardsInMotion);
	// Finalize packet and send to every player
	var packet = {playerPackets: playrPacket, cards: cardsToDraw, cardsInMotion: cardsInMotion};
	// for(var i in SOCKET_LIST){
	// 	var socket = SOCKET_LIST[i];
	// 	socket.emit('draw',packet);
	// }
	broacast('draw', packet)

	
	//Sets fps 25
}, 1000/25);

function broacast(key, packet) {
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit(key,packet);
	}
}