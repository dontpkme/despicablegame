var cardNum = 0;
var myAttackCard = [];
var myShieldCard = [];
var myMoveCard = [];

$(document).ready(function() {
	doDeal(10);
	doSort();
	doShowCard(function() {
		$(this).removeClass("hover");
	});
});

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
	var ww = $(window).width();
	var wh = $(window).height();
}

$(window).resize(function() {
	render();
});

var getCardView = function(idx) {
	var source = $("#card-template").html();
	var template = Handlebars.compile(source);
	var html = template(cards[idx]);
	return html;
}

var doDeal = function(n) {
	if(n==undefined)
		n=1;
	cardNum += n;

	for(var i=0; i<n; i++) {
		var idx = Math.floor(Math.random() * cards.length);
		var card = cards[idx];
		switch(card.type) {
			case "attack":
				myAttackCard.push(card);
				break;
			case "shield":
				myShieldCard.push(card);
				break;
			case "move":
				myMoveCard.push(card);
				break;
		}
		$("#cardRow").append(getCardView(idx));
	}

	$(".card").unbind("click").click(function(e) {
		var $target;
		if ($(e.target).hasClass("card"))
			$target = $(e.target);
		else
			$target = $(e.target).parents(".card");

		$(".card.selectedCard").animate({
			"top": "70px"
		}, 100)
		if($target.hasClass("selectedCard")) {
			$(".card").removeClass("selectedCard");
		} else {
			$(".card").removeClass("selectedCard");
			$target.addClass("selectedCard").animate({
				"top": "30px"
			}, 300);
		}
		doShowCard();
	});

	$(".dealing").animate({
		"top": "70px"
	}, 600, function() {
		$(".dealing").removeClass("dealing");
	});
}

var doSort = function() {
}

var doShowCard = function(cb) {
	var cardNum = $(".card").length;
	var xCursor = 0;
	var lastIsSelected = false;
	
	$.each($(".card"), function(i, v) {
		var $v = $(v);
		if (lastIsSelected) {
			xCursor += 125;
			lastIsSelected = false;
		}
		if ($v.hasClass("selectedCard"))
			lastIsSelected = true;
		xCursor += 50;
		$(v).animate({
			"left": xCursor + "px"
		}, 300, cb);
	});
}

var doFlip = function(idx) {
	if(idx==undefined)
		$(".card").toggleClass("hover");
	else
		$(".card:nth-child("+(idx+1)+")").toggleClass("hover");
}