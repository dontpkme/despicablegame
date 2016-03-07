var cardNum = 5;
var myAttackCard = [];
var myShieldCard = [];
var myMoveCard = [];
var cardSpacing = 50;
var cardDeckW;
var status = "normal";
var selection = undefined;
var round = 0;

$(document).ready(function() {
	render();
	cardNum = 0;
	setTimeout("doDeal();doShowCard(null,false);", 100);
	setTimeout("doDeal();doShowCard(null,false);", 200);
	setTimeout("doDeal();doShowCard(null,false);", 300);
	setTimeout("doDeal();doShowCard(null,false);", 400);
	setTimeout("doDeal();doShowCard(null,false);", 500);
	setTimeout("$('.card').removeClass('hover');", 1500);
	setTimeout("doNewRound();", 2000);

	$(".dice").click(function() {
		doDice();
	});

	$("#additionalDeal").click(function() {
		if (confirm("進行一次額外抽牌嗎?")) {
			doDeal();
			doSort();
			doShowCard(function() {
				$(".card").removeClass("hover");
			});
		}
	});

	$("#drop").click(function() {
		if (status == "normal") {
			if (confirm("進行一次棄牌嗎?")) {
				status = "droping";
				$(".card").addClass("hover");
				if (selection != undefined) {
					$(".card.selectedCard").removeClass("selectedCard").animate({
						"top": "70px"
					}, 100, function() {
						doShowCard(null, false);
					});
				}
			}
		} else if (status == "droping") {
			status = "normal";
			$(".card").removeClass("hover");
		}
	});

	$("#take").click(function() {
		if (status == "normal") {
			if (confirm("進行一次奪牌嗎?")) {
				status = "taking";
				$(".card").addClass("hover");
				if (selection != undefined) {
					$(".card.selectedCard").removeClass("selectedCard").animate({
						"top": "70px"
					}, 100, function() {
						doShowCard(null, false);
					});
				}
			}
		} else if (status == "taking") {
			status = "normal";
			$(".card").removeClass("hover");
		}
	});

	$(".table").click(function() {
		if (confirm("確定要翻桌重玩?")) {
			location.reload();
		}
	});

	$("#play").click(function() {
		if (selection == undefined) {
			alert("請先選一張牌");
			return;
		}
		console.log($(selection).attr("data-idx"));
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
	cardDeckW = ww - 120;
	cardSpacing = (cardDeckW - 280) / cardNum;

	var arh = wh * 0.08;
	$(".actionRow").css({
		"height": arh + "px",
		"line-height": arh + "px",
		"text-align": "center",
		"border-radius": (arh / 2) + "px"
	});
}

$(window).resize(function() {
	render();
});

var getCardView = function(idx) {
	var source = $("#card-template").html();
	var template = Handlebars.compile(source);
	var data = cards[idx];
	data.idx = idx;
	var html = template(data);
	return html;
}

var doDeal = function(n) {
	if (n == undefined)
		n = 1;
	cardNum += n;

	for (var i = 0; i < n; i++) {
		var idx = Math.floor(Math.random() * cards.length);
		var card = cards[idx];
		switch (card.type) {
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
		if ($target.hasClass("selectedCard")) {
			$(".card").removeClass("selectedCard");
			selection = undefined;
		} else {
			$(".card").removeClass("selectedCard");
			$target.addClass("selectedCard").animate({
				"top": "30px"
			}, 300);
			selection = $target;
		}
		doShowCard();
	});

	$(".dealing").animate({
		"top": "70px"
	}, 600, function() {
		$(".dealing").removeClass("dealing");
	});
}

var doSort = function() {}

var doShowCard = function(cb, reCalCardSpacing) {
	var cardNum = $(".card").length;
	var xCursor = 0;
	var lastIsSelected = false;
	if (reCalCardSpacing == undefined)
		reCalCardSpacing = true;
	if (reCalCardSpacing)
		cardSpacing = (cardDeckW - 280) / cardNum;

	$.each($(".card"), function(i, v) {
		var $v = $(v);
		if (lastIsSelected) {
			xCursor += 120;
			lastIsSelected = false;
		}
		if ($v.hasClass("selectedCard"))
			lastIsSelected = true;
		xCursor += cardSpacing;
		$(v).animate({
			"left": xCursor + "px"
		}, 300);
	});
	if (cb != undefined)
		cb();
}

var doFlip = function(idx) {
	if (idx == undefined)
		$(".card").toggleClass("hover");
	else
		$(".card:nth-child(" + (idx + 1) + ")").toggleClass("hover");
}

var doDice = function() {
	var t = setInterval("doRandomDice()", 10);
	$(".diceView").fadeIn(function() {
		clearInterval(t);
		$(".diceView").animate({
			"top": "0"
		}, 1500, function() {
			$(".diceView").fadeOut();
		})
	});
}

var doRandomDice = function() {
	var r = Math.floor(Math.random() * 100) + 1;
	$(".diceNumber").text(r);
};

var doNewRound = function() {
	round++;
	$(".roundNumber").text(round);
	$(".roundView").fadeIn(function() {
		$(".roundView").animate({
			"top": "0"
		}, 1000, function() {
			$(".roundView").fadeOut(function() {
				doDeal();
				doSort();
				doShowCard(function() {
					$(".card").removeClass("hover");
				});
			});
		})
	});
}