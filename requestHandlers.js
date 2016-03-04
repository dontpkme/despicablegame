const PUBLIC_URL = "13techart.ddns.net:81";
const PRIVATE_URL = "192.168.1.118:81";
const APP_ID = "821211784657861";
const APP_SECRET = "53889e4a25873a1c9596202143486fe2";

var req = require('request');
var mime = require('mime-types');
var fs = require('fs');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var io = require('socket.io')(); // 加入 Socket.IO
var util = require('./util.js');
var dao = require('./dao.js');

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

var downloadAvatar = function(id, callback) {
	var url = "http://graph.facebook.com/" + id + "/picture?width=200&height=200";
	var dest = "./static/image/avatar/" + id + ".jpg";
	var file = fs.createWriteStream(dest);
	var getRealUrlRequest = http.get(url, function(response) {
		url = response.headers.location.replace("https", "http");

		var downloadRequest = http.get(url, function(response) {
			response.pipe(file);
			file.on('finish', function() {
				file.close(callback); // close() is async, call cb after close completes.
			});
		}).on('error', function(err) { // Handle errors
			fs.unlink(dest); // Delete the file async. (But we don't check the result)
			if (callback)
				callback(err.message);
		});
	}).on('error', function(err) { // Handle errors
		fs.unlink(dest); // Delete the file async. (But we don't check the result)
		if (callback)
			callback(err.message);
	});
};

exports.index = function(request, response) {
	var code = qs.parse(url.parse(request.url).query).code;
	if (code !== undefined) {
		var appSecret = APP_SECRET;
		var appId = APP_ID;
		var u = "https://graph.facebook.com/v2.3/oauth/access_token?client_id=" + appId +
			"&redirect_uri=http://" + request.headers.host + "/" +
			"&client_secret=" + appSecret +
			"&code=" + code;
		req(u, function(error, response2, body) {
			if (!error && response2.statusCode == 200) {
				var u2 = "https://graph.facebook.com/me?access_token=" + JSON.parse(body).access_token;
				req(u2, function(error2, response3, body2) {
					if (!error2 && response3.statusCode == 200) {
						var me = JSON.parse(body2);
						response.writeHead(302, {
							'Location': '/?id=' + me.id + '&name=' + encodeURIComponent(me.name)
						});
						response.end();
					} else {
						response.writeHead(302, {
							'Location': '/?error=fblogin'
						});
						response.end();
					}
				});
			} else {
				console.log("========== Something wrong with Facebook login ==========");
				console.log(error);
				response.writeHead(302, {
					'Location': '/?error=fblogin'
				});
				response.end();
			}
		});
	} else {
		_returnFile("/index.html", response);
	}
};

exports.returnFile = function(request, response) {
	var path = util.getPathname(request);
	_returnFile(path, response);
};

exports.getSharePage = function(request, response) {
	var name = decodeURIComponent(qs.parse(url.parse(request.url).query).name);
	var star = decodeURIComponent(qs.parse(url.parse(request.url).query).star);
	fs.readFile(__dirname + "/static/share.html", function(error, data) {
		if (error) {
			response.writeHead(404);
			response.write("oops this doesn't exist - 404");
		} else {
			response.writeHead(200, {
				"Content-Type": "text/html"
			});
			var text = data.toString();
			text = text.replace(/\{\{name\}\}/g, name);
			text = text.replace(/\{\{star\}\}/g, star);
			response.write(text, "utf8");
		}
		response.end();
	});
}

exports.findGameByCode = function(request, response) {
	var code = qs.parse(url.parse(request.url).query).code;
	if (code === undefined) {
		dao.findGame(function(data) {
			response.writeHead(200, {
				'Content-Type': 'text/html',
				'Access-Control-Allow-Origin': "*",
				'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept"
			});
			response.write(JSON.stringify(data));
			response.end();
		}, function(e) {
			console.trace(e.stack);
			exports.findGameByCode(request, response);
		});
	} else {
		dao.findGameByCode(code, function(data) {
			util.initTextResponse(response, JSON.stringify(data));
		}, function(e) {
			console.trace(e.stack);
			exports.findGameByCode(request, response);
		});
	}
};

exports.createGame = function(request, response) {
	isGameFinished = false;
	dao.updateAllGameStatus("finished", function() {
		dao.createGame(function(data) {
			util.kickedPlayers = [];
			util.socketsBroadcast("system", "newgame");
			util.initTextResponse(response, JSON.stringify(data.ops[0]));
		}, function(e) {
			console.trace(e.stack);
			util.initTextResponse(response, "Create game failed", 400);
		});
	}, function(e) {
		console.trace(e.stack);
		util.initTextResponse(response, "Create game failed", 400);
	});
};

exports.gameStart = function(request, response) {
	util.refreshSockets();
	util.socketsBroadcast("system", "gamestart");
	util.initTextResponse(response, "OK");
	util.kickedPlayers = [];
};

exports.createPlayer = function(request, response) {
	if (request.headers.host == PRIVATE_URL) {
		util.readPostData(request, response, function(postData) {
			dao.createPlayer(postData.code, postData.name, postData.seat, postData.avatar,
				function(data) {
					var player = data.ops[0];
					util.initTextResponse(response, player._id.toString());
					util.socketsBroadcast("login", player._id + "::" + player.seat + "::" + player.avatar + "::" + player.name);
				},
				function(e) {
					console.trace(e.stack);
					util.initTextResponse(response, "Failed", 400);
				});
			if (postData.avatar !== "default1" && postData.avatar !== "default2" && postData.avatar !== "default3" && postData.avatar !== "default4") {
				downloadAvatar(postData.avatar, function() {
					console.log("Downloaded");
				});
			}
		});
	} else {
		util.initTextResponse(response, "Forbidden", 403);
	}
};

exports.removePlayer = function(request, response) {
	var id = qs.parse(url.parse(request.url).query).id;
	dao.removePlayer(id, function() {
		util.kickedPlayers.push(id);
		response.writeHead(200, {
			'Content-Type': 'text/html',
			'Access-Control-Allow-Origin': "*",
			'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept"
		});
		response.write("OK");
		response.end();
	}, function() {
		util.initTextResponse(response, "Remove data failed.", 400);
	});
}

exports.findPlayersByCodeAndSeat = function(request, response) {
	var code = qs.parse(url.parse(request.url).query).code;
	var seat = qs.parse(url.parse(request.url).query).seat;
	var search = function() {
		if (seat === undefined) {
			dao.findPlayersByCode(code,
				function(data) {
					response.writeHead(200, {
						'Content-Type': 'text/html',
						'Access-Control-Allow-Origin': "*",
						'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept"
					});
					response.write(JSON.stringify(data));
					response.end();
				},
				function(e) {
					search();
				});
		} else {
			dao.findPlayersBySeat(seat,
				function(data) {
					util.initTextResponse(response, JSON.stringify(data));
				},
				function(e) {
					search();
				});
		}
	};

	search();
};

exports.updatePlayer = function(request, response) {
	util.readPostData(request, response, function(postData) {
		try {
			for (i = 0; i < postData.length; i++) {
				postData[i].score = parseInt(postData[i].score);
			}
			dao.updatePlayer(postData, function() {
				util.initTextResponse(response, "OK");
			}, function(e) {
				console.trace(e.stack);
				util.initTextResponse(response, "Update player failed.", 400);
			});
		} catch (e) {
			console.trace(e.stack);
			util.initTextResponse(response, "Update score failed.", 400);
		}
	});
}

exports.updateGame = function(request, response) {
	util.readPostData(request, response, function(postData) {
		switch (postData.status) {
			case "playing":
				util.kickedPlayers = [];
				util.refreshSockets();
				util.socketsBroadcast("system", "gamestart");
				break;
			case "finished":
				isGameFinished = true;
				util.refreshSockets();
				util.socketsBroadcast("system", "gameover");
				break;
		}
		try {
			dao.updateGame(postData, function() {
				util.initTextResponse(response, "OK");
			}, function(e) {
				console.trace(e.stack);
				util.initTextResponse(response, "Update game failed.", 400);
			});
		} catch (e) {
			console.trace(e.stack);
			util.initTextResponse(response, "Update game failed.", 400);
		}
	});
}

setInterval(function() {
	if (isGameFinished) {
		util.socketsBroadcast("system", "gameover");
	}
	if (util.kickedPlayers.length > 0) {
		for (var i = 0; i < util.kickedPlayers.length; i++) {
			util.socketsBroadcast("kick", util.kickedPlayers[i]);
		}
	}
}, 1000);