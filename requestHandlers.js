var req = require('request');
var mime = require('mime-types');
var fs = require('fs');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var io = require('socket.io')(); // 加入 Socket.IO
var util = require('./util.js');

var isGameFinished = false;

var _returnFile = function(path, response) {
	fs.readFile(__dirname + "/static" + path, function(error, data) {
		if (error) {
			response.writeHead(404);
			response.write("oops this doesn't exist - 404");
		} else {
			response.writeHead(200, {
				"Content-Type": mime.lookup(path)
			});
			response.write(data, "utf8");
		}
		response.end();
	});
}

exports.index = function(request, response) {
	_returnFile("/index.html", response);
};

exports.returnFile = function(request, response) {
	var path = util.getPathname(request);
	_returnFile(path, response);
};

exports.gameStart = function(request, response) {
	util.refreshSockets();
	util.socketsBroadcast("system", "gamestart");
	util.initTextResponse(response, "OK");
};