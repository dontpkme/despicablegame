var url = require('url');

exports.sockets = [];
exports.kickedPlayers = [];

exports.initTextResponse = function(response, data, statusCode) {
	if (statusCode === undefined)
		statusCode = 200;
	response.writeHead(statusCode, {
		'Content-Type': 'text/html'
	});
	response.write(data);
	response.end();
};

exports.refreshSockets = function() {
	for (i = this.sockets.length - 1; i >= 0; i--) {
		if (this.sockets[i].disconnected) {
			this.sockets.splice(i, 1);
		}
	}
}

exports.socketsBroadcast = function(channel, message) {
	for (i = this.sockets.length - 1; i >= 0; i--) {
		this.sockets[i].emit(channel, {
			message: message
		});
	}
}

exports.readPostData = function(request, response, onData) {
	var that = this;
	var body = "";
	request.on("data", function(data) {
		body += data;
		// Too much POST data, kill the connection!
		if (body.length > 1e6)
			request.connection.destroy();
	});

	request.on("end", function() {
		try {
			var postData = JSON.parse(body);
			if (onData !== undefined)
				onData(postData);
		} catch (e) {
			console.trace(e.stack);
			that.initTextResponse(response, "Read Post Data Failed.", 400);
		}
	});
}

exports.getPathname = function(request) {
	return decodeURI(url.parse(request.url).pathname);
};