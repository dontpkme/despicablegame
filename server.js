const CARD_NUM = 55;

var http = require("http");
var io = require('socket.io'); // 加入 Socket.IO
var util = require('./util.js');

var initSocket = function(server) {
	var cards = [];
	var usedCards = [];
	var serv_io = io.listen(server);
	var play1p, play2p, end1p = false,
		end2p = false;

	var initCards = function() {
		cards = [];
		usedCards = [];
		for (var i = 0; i < CARD_NUM; i++) {
			cards.push(i);
		}
	}
	var shuffle = function() {
		console.log("do shuffle");
		for (var i = 0; i < cards.length; i++) {
			var nowN = i;
			var changeN = Math.floor(Math.random() * cards.length);
			var nowV = cards[nowN];
			var changeV = cards[changeN];
			if (nowN != changeN) {
				var tempV = nowV;
				cards[nowN] = changeV;
				cards[changeN] = tempV;
			}
		}
	}
	var checkCardLeft = function() {
		console.log(cards.length + ":" + usedCards.length);
		if (cards.length == 0) {
			console.log("recycle used cards");
			cards = [];
			for (var i = 0; i < usedCards.length; i++) {
				cards.push(usedCards[i]);
			}
			shuffle();
			usedCards = [];
		}
	}

	serv_io.sockets.on('connection', function(socket) {
		console.log("create a web socket connection.");

		socket.on("join", function(data) {
			util.refreshSockets();
			console.log("now socket client:" + util.sockets.length);
			if (util.sockets.length == 1) {
				util.socketsBroadcast("system", "gamewait");
			} else if (util.sockets.length == 2) {
				util.socketEmitByIndex(0, "system", "player::1p");
				util.socketEmitByIndex(1, "system", "player::2p");
				util.socketsBroadcast("system", "gamestart");
				initCards();
				shuffle();
			}
		});

		socket.on("play", function(data) {
			usedCards.push(data.idx);
			console.log("play:" + data.idx);
			checkCardLeft();

			switch (data.player) {
				case "1p":
					play1p = data.idx;
					break;
				case "2p":
					play2p = data.idx;
					break;
			}
			if (play1p != undefined && play2p != undefined) {
				util.socketsBroadcast("system", "pk::" + play1p + "::" + play2p);
				play1p = undefined;
				play2p = undefined;
			}
		});

		socket.on("end", function(data) {
			console.log("end:" + data.player);
			switch (data.player) {
				case "1p":
					end1p = true;
					break;
				case "2p":
					end2p = true;
					break;
			}
			if (end1p && end2p) {
				util.socketsBroadcast("system", "newround");
				end1p = false;
				end2p = false;
			}
		});

		socket.on("dice", function(data) {
			console.log("dice:" + data.dice);
			switch (data.player) {
				case "1p":
					util.socketEmitByIndex(1, "system", "dice::" + data.dice);
					break;
				case "2p":
					util.socketEmitByIndex(0, "system", "dice::" + data.dice);
					break;
			}
		});

		socket.on("deal", function(data) {
			var dealedCard = cards.pop();
			console.log("deal:" + dealedCard);
			checkCardLeft();

			switch (data.player) {
				case "1p":
					util.socketEmitByIndex(0, "system", "deal::" + dealedCard);
					break;
				case "2p":
					util.socketEmitByIndex(1, "system", "deal::" + dealedCard);
					break;
			}
		});

		socket.on("reset", function(data) {
			console.log("reset");
			play1p = undefined;
			play2p = undefined;
			end1p = false;
			end2p = false;
			util.socketsBroadcast("system", "reset");

			initCards();
			shuffle();
		});

		socket.on("drop", function(data) {
			console.log(data.player + " wants to drop");

			switch (data.player) {
				case "1p":
					util.socketEmitByIndex(1, "system", "drop::" + data.num);
					break;
				case "2p":
					util.socketEmitByIndex(0, "system", "drop::" + data.num);
					break;
			}
		});

		socket.on("dropped", function(data) {
			usedCards.push(data.idx);
			console.log("dropped:" + data.idx);
			checkCardLeft();
		});

		socket.on("take", function(data) {
			console.log(data.player + " wants to take");
			switch (data.player) {
				case "1p":
					util.socketEmitByIndex(1, "system", "take::" + data.num);
					break;
				case "2p":
					util.socketEmitByIndex(0, "system", "take::" + data.num);
					break;
			}
		});

		socket.on("get", function(data) {
			console.log(data.player + " wants to return");
			switch (data.player) {
				case "1p":
					util.socketEmitByIndex(1, "system", "get::" + data.idx);
					break;
				case "2p":
					util.socketEmitByIndex(0, "system", "get::" + data.idx);
					break;
			}
		});

		socket.on("additionalPlay", function(data) {
			usedCards.push(data.idx);
			console.log(data.player + " additionally play " + data.idx);
			checkCardLeft();

			switch (data.player) {
				case "1p":
					util.socketEmitByIndex(1, "system", "additionalPlay::" + data.idx);
					break;
				case "2p":
					util.socketEmitByIndex(0, "system", "additionalPlay::" + data.idx);
					break;
			}
		});

		util.sockets.push(socket);
		util.refreshSockets();

		socket.on('disconnect', function() {
			console.log('user disconnected');
			util.refreshSockets();
			if (util.sockets.length == 1) {
				util.socketsBroadcast("system", "gamewait");
			}
		});
	});
}

exports.start = function(route) {
	var onRequest = function(request, response) {
		route(request.method, request, response);
	}
	var server = http.createServer(onRequest).listen(9393);
	initSocket(server);
};

console.log("server started at " + new Date());