var http = require("http");
var io = require('socket.io'); // 加入 Socket.IO
var util = require('./util.js');

var initSocket = function(server) {
	var serv_io = io.listen(server);

	serv_io.sockets.on('connection', function(socket) {
		console.log("create a web socket connection.");

		socket.on("kick", function(data) {
			var idx = -1;
			for (var i = 0; i < util.kickedPlayers.length; i++) {
				if (util.kickedPlayers[i] == data.id) {
					idx = i;
					break;
				}
			}
			if (idx > -1) {
				util.kickedPlayers.splice(idx, 1);
			}
		});

		util.sockets.push(socket);
		util.refreshSockets();

		socket.on('disconnect', function() {
			console.log('user disconnected');
			util.refreshSockets();
		});
	});
}

exports.start = function(route) {
	var onRequest = function(request, response) {
		route(request.method, request, response);
	}
	var server = http.createServer(onRequest).listen(81);
	initSocket(server);
};

console.log("server started at " + new Date());