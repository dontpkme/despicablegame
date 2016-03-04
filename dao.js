const DB_NAME = "leofoo";
const PLAYER_COLLECTION = "player";
const GAME_COLLECTION = "game";

var mongodb = require('mongodb');
var db = null;
var isDbOpened = false;

var getDb = function() {
	if (db == null || isDbOpened === false) {
		db = new mongodb.Db(DB_NAME, mongodbServer);
		db.on('close', function() {
			isDbOpened = false;
		});
	}
	return db;
}

var openDb = function(callback) {
	if (!isDbOpened) {
		db.open(function() {
			callback();
			isDbOpened = true;
		});
	} else {
		callback();
	}
}

var mongodbServer = new mongodb.Server('localhost', 27017, {
	auto_reconnect: true,
	poolSize: 10
});

var padLeft = function(str, len) {
	str = '' + str;
	return str.length >= len ? str : new Array(len - str.length + 1).join("0") + str;
}

var create = function(collectionName, model, success, fail) {
	db = getDb();
	openDb(function() {
		db.collection(collectionName, function(err, collection) {
			collection.insert(model, function(err, data) {
				if (data) {
					if (success != undefined)
						success(data);
				} else {
					if (fail != undefined)
						fail(err);
				}
			});
		});
	});
};

var update = function(collectionName, criteria, model, success, fail) {
	db = getDb();
	if (Object.prototype.toString.call(criteria) === Object.prototype.toString.call([])) {
		if (criteria.length > 0) {
			openDb(function() {
				var collection = db.collection("player");
				var bulk = collection.initializeUnorderedBulkOp({
					useLegacyOps: true
				});
				for (i = 0; i < criteria.length; i++) {
					bulk.find(criteria[i]).update(model[i]);
				}
				bulk.execute(function(err, data) {
					if (data) {
						if (success != undefined)
							success(data);
					} else {
						if (fail != undefined)
							fail(err);
					}
				});
			});
		} else {
			success();
		}
	} else {
		openDb(function() {
			db.collection(collectionName, function(err, collection) {
				collection.update(criteria, {
					$set: model
				}, {
					multi: true
				}, function(err, data) {
					if (data) {
						if (success != undefined)
							success(data);
					} else {
						if (fail != undefined)
							fail(err);
					}
				});
			});
		});
	}
};

var remove = function(collectionName, criteria, success, fail) {
	db = getDb();
	openDb(function() {
		db.collection(collectionName, function(err, collection) {
			collection.deleteOne(criteria, function(err, data) {
				if (!err) {
					if (success != undefined)
						success(data);
				} else {
					if (fail != undefined)
						fail(err);
				}
			});
		});
	});
}

var find = function(collectionName, criteria, option, success, fail) {
	db = getDb();
	openDb(function() {
		db.collection(collectionName, function(err, collection) {
			collection.find(criteria, option).toArray(function(err, items) {
				if (!err) {
					var data = [];
					if (success != undefined) {
						for (i = 0; i < items.length; i++) {
							data.push(items[i]);
						}
						success(data);
					}
				} else {
					if (fail != undefined)
						fail(err);
				}
			});
		});
	});
};

exports.createPlayer = function(code, name, seat, avatar, success, fail) {
	var model = {
		code: code,
		name: name,
		seat: seat,
		avatar: avatar,
		score: 0
	};
	create(PLAYER_COLLECTION, model, success, fail);
};

exports.removePlayer = function(id, success, fail) {
	remove(PLAYER_COLLECTION, {
		"_id": mongodb.ObjectID(id)
	}, success, fail);
};

exports.updatePlayer = function(postData, success, fail) {
	var criterias = [];
	var models = [];
	for (i = 0; i < postData.length; i++) {
		criterias.push({
			"_id": mongodb.ObjectID(postData[i]["_id"])
		});
		models.push({
			"$set": {
				score: postData[i]["score"]
			}
		});
	}
	update(PLAYER_COLLECTION, criterias, models, success, fail);
};

exports.updateGame = function(postData, success, fail) {
	update(GAME_COLLECTION, {
		"_id": mongodb.ObjectID(postData["_id"])
	}, {
		status: postData.status
	}, success, fail);
};

exports.updateAllGameStatus = function(status, success, fail) {
	update(GAME_COLLECTION, {}, {
		status: status
	}, success, fail);
};

exports.createGame = function(success, fail) {
	var now = new Date();
	var model = {
		date: now,
		status: "ready",
		code: padLeft(now.getTime() % 10000, 4)
	};

	db = getDb();
	openDb(function() {
		db.collection("player").drop(function(err, response) {
			db.collection("game").drop(function(err, response) {
				create(GAME_COLLECTION, model, success, fail);
			});
		});
	});
};

exports.findPlayersByCode = function(code, success, fail) {
	find(PLAYER_COLLECTION, {
		code: code
	}, {
		sort: {
			score: -1
		}
	}, success, fail);
};

exports.findPlayersBySeat = function(seat, success, fail) {
	find(PLAYER_COLLECTION, {
		seat: seat,
	}, {}, success, fail);
};

exports.findGame = function(success, fail) {
	find(GAME_COLLECTION, {}, {}, success, fail);
};

exports.findGameByCode = function(code, success, fail) {
	find(GAME_COLLECTION, {
		code: code
	}, {}, success, fail);
};