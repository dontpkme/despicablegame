const PUBLIC_HOST = "13techart.ddns.net:81";
const PRIVATE_HOST = "192.168.1.118:81";
const STAR5_SCORE = 100;
const STAR4_SCORE = 75;
const STAR3_SCORE = 50;
const STAR2_SCORE = 25;
const COOKIE_LIFETIME = 30; // in minute
const APP_ID = '821211784657861';

var fbId, fbName;
var isFbLogin = false;
var fbName = "";
var fbAvatar = "";
var step = "1";
var playerName = "";
var playerAvatar = "";
var code = "";
var seat = "";
var id = "";
var ended = false;
var myHost = location.host;

var heartbeat = new Date().getTime();
var socket;
var redirect = false;
var backupCode = "";

$(document).ready(function() {});

var socketConnect = function() {
	socket = io.connect();
	socket.on("connect", function() {
		// alert("connect");
	});
	socket.on("disconnect", function() {
		// alert("disconnect");
	});
	socket.on("reconnect", function() {
		// alert("reconnect");
	});
	socket.on("system", function(data) {
		switch (data.message.split("::")[0]) {
			case "newgame":
				clearCookie();
				location.replace("http://" + PRIVATE_HOST + "/");
				break;
			case "gamestart":
				$("#status").text("遊戲開始了");
				step = "4-1";
				updateCookie();
				break;
			case "gameover":
				if (myHost != PUBLIC_HOST) {
					if (!redirect) {
						redirect = true;
						if ($.cookie("seat") != seat || $.cookie("code") != code || code == "" || seat == "" || $.cookie("code") == "" || $.cookie("seat") == "" || code == undefined || seat == undefined || $.cookie("code") == undefined || $.cookie("seat") == undefined) {
							var hash = location.hash.split("#");
							code = hash[1];
							seat = hash[2];
							// alert("偵測到cookie異常, 啟動備援紀錄: " + code + "/" + seat);
						}
						if (code == "" || seat == "" || code == undefined || seat == undefined) {
							// alert("資料短缺!\ncookie1: " + $.cookie("seat") + "\ncookie2: " + $.cookie("code") + "\n參數1: " + seat + "\n參數2: " + code + "\n導向:http://" + PUBLIC_HOST + "/?ckseat=" + seat + "&ckcode=" + code);
						}
						clearCookie();
						location.replace("http://" + PUBLIC_HOST + "/?ckseat=" + seat + "&ckcode=" + code);
					}
				} else {
					if (!ended) {
						getRankList();
						ended = true;
					}
				}
				break;
		}
	});
	socket.on("kick", function(data) {
		var kickId = data.message;
		if (kickId == id) {
			socket.emit("kick", {
				id: id
			});
			clearCookie();
			location.reload();
		}
	});
}

var render = function() {

}

$(window).resize(function() {
	render();
});