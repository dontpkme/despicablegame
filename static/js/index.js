var cardTopNormal = 100;
var cardTopSelected = 30;
var cardSpacing = 50;
var socket;
var ww, wh;

var cardNum = 5;
var myAttackCard = [];
var myShieldCard = [];
var myMoveCard = [];
var cardDeckW;
var status = "wait";
var selection = undefined;
var round = 0;
var player = "";
var resetByMe = false;
var canDropNum = 0;
var dropNum = 0;
var canTakeNum = 0;
var takeNum = 0;
var adNum = 0;
var additionalPlayType;
var additionalPlayNum;
var roundEnd = false;

$(document).ready(function() {
	$(".step2").hide();
	$(".step3").hide();
	render();
	socketConnect();

	$(".pkView").click(function() {
		$(".pkView").fadeOut();
		$(".pkRow").empty();
	});

	$(".additionalPlayView").click(function() {
		$(".additionalPlayView").fadeOut(function() {
			$(".apRow").empty();
		});
	});

	$(".dice").click(function() {
		doDice();
	});

	$("#end").click(function() {
		doEnd();
	});

	$("#draw").click(function() {
		if (adNum > 0) {
			doDeal();
			doSort();
			doShowCard(function() {
				setTimeout('$(".card").removeClass("hover")', 1000);
			});
			adNum--;
		}
		if (adNum == 0) {
			$("#draw").fadeOut();
		}
	});

	$("#drop").click(function() {
		socket.emit("drop", {
			player: player,
			num: canDropNum
		});
		$("#drop").fadeOut();
	});

	$("#dropOk").click(function() {
		if (dropNum == 0) {
			status = "normal";
			$(".card").removeClass("hover");
			$(".step3").hide();
			if (!roundEnd)
				$(".step2").fadeIn();
		} else if (dropNum > 0) {
			if (selection == undefined) {
				alert("請先選一張牌");
				return;
			}
			dropNum--;
			$(selection).removeClass("hover");
			setTimeout("doDrop();", 1000);

			if (dropNum == 0)
				$("#dropOk").text("完成棄牌");
		}
	});

	$("#take").click(function() {
		socket.emit("take", {
			player: player,
			num: canTakeNum
		});
		$("#take").fadeOut();
	});

	$("#takeOk").click(function() {
		if (takeNum == 0) {
			status = "normal";
			$(".card").removeClass("hover");
			$(".step3").hide();
			if (!roundEnd)
				$(".step2").fadeIn();
		} else if (takeNum > 0) {
			if (selection == undefined) {
				alert("請先選一張牌");
				return;
			}
			takeNum--;
			$(selection).removeClass("hover");
			setTimeout("doDrop();doTake()", 1000);

			if (takeNum == 0)
				$("#takeOk").text("完成奪牌");
		}
	});

	$(".table").click(function() {
		if (confirm("確定要翻桌?")) {
			socket.emit("reset", {});
		}
	});

	$("#play").click(function() {
		if (selection == undefined) {
			alert("請先選一張牌");
			return;
		}
		socket.emit("play", {
			"player": player,
			"idx": $(selection).attr("data-idx")
		});
		doDrop();
		$(".step1").fadeOut();
	});

	$("#additionalPlay").click(function() {
		var card = cards[$(selection).attr("data-idx")];
		if (selection == undefined) {
			alert("請先選一張牌");
			return;
		} else if (card.type != additionalPlayType) {
			alert("現在只能出" + (additionalPlayType == "attack" ? "攻擊牌" : (additionalPlayType == "shield" ? "防禦牌" : "移動牌")));
			return;
		}
		socket.emit("additionalPlay", {
			"player": player,
			"idx": $(selection).attr("data-idx")
		});
		doDrop();

		additionalPlayNum--;
		if (additionalPlayNum == 0) {
			$("#additionalPlay").fadeOut(function() {
				action = card.action;
				$.each(action, function(i, v) {
					if (v.draw) {
						$("#draw").show();
						adNum = v.draw;
					}
					if (v.additionalPlay) {
						$("#additionalPlay").show();
						additionalPlayType = v.type;
						additionalPlayNum = v.additionalPlay;
					}
					if (v.drop) {
						$("#drop").show();
						canDropNum = v.drop;
					}
					if (v.take) {
						$("#take").show();
						canTakeNum = v.take;
					}
				});
			});
		}
	});
});

var reset = function() {
	$("#cardRow").empty();
	$(".pkRow").empty();
	$(".apRow").empty();
	cardNum = 5;
	myAttackCard = [];
	myShieldCard = [];
	myMoveCard = [];
	cardDeckW;
	status = "normal";
	selection = undefined;
	round = 0;
	dropNum = 0;
	canDropNum = 0;
	takeNum = 0;
	canTakeNum = 0;
	adNum = 0;

	render();
	cardNum = 0;
	setTimeout("doDeal();doShowCard(null,false);", 100);
	setTimeout("doDeal();doShowCard(null,false);", 200);
	setTimeout("doDeal();doShowCard(null,false);", 300);
	setTimeout("doDeal();doShowCard(null,false);", 400);
	setTimeout("doDeal();doShowCard(null,false);", 500);
	setTimeout("$('.card').removeClass('hover');", 1500);
	setTimeout("doNewRound();", 2000);

	$(".step1").fadeIn();
	$(".step2,.step3").fadeOut();
	$(".pkView").hide();
}

var socketConnect = function() {
	socket = io.connect();
	socket.on("connect", function() {
		socket.emit("join", {});
	});
	socket.on("disconnect", function() {
		// alert("disconnect");
	});
	socket.on("reconnect", function() {
		// alert("reconnect");
	});
	socket.on("system", function(data) {
		switch (data.message.split("::")[0]) {
			case "gamewait":
				if (status != "wait") {
					$(".waitView").fadeIn();
				}
				break;
			case "gamestart":
				$(".waitView").fadeOut();
				status = "normal";
				reset();
				break;
			case "player":
				player = data.message.split("::")[1];
				break;
			case "pk":
				var pk1p = data.message.split("::")[1];
				var pk2p = data.message.split("::")[2];
				$(".step1").fadeOut(400, function() {
					if (player == "1p") {
						var action = cards[pk1p].action;
						if (cards[pk1p].name == "騎士盔甲" && cards[pk2p].type == "attack") {
							action = cards[pk2p].action;
						} else if (cards[pk2p].name == "騎士盔甲" && cards[pk1p].type == "attack") {
							action = [];
						}
						$(".p1").html("<span class='me'>我方</span>");
						$(".p2").html("<span class='enemy'>對方</span>");
					} else if (player == "2p") {
						var action = cards[pk2p].action;
						if (cards[pk2p].name == "騎士盔甲" && cards[pk1p].type == "attack") {
							action = cards[pk1p].action;
						} else if (cards[pk1p].name == "騎士盔甲" && cards[pk2p].type == "attack") {
							action = [];
						}
						$(".p1").html("<span class='enemy'>對方</span>");
						$(".p2").html("<span class='me'>我方</span>");
					}
					$("#draw,#additionalPlay,#drop,#take,#dropOk,#takeOk").hide();
					$.each(action, function(i, v) {
						if (v.draw) {
							$("#draw").show();
							adNum = v.draw;
						}
						if (v.additionalPlay) {
							$("#additionalPlay").show();
							additionalPlayType = v.type;
							additionalPlayNum = v.additionalPlay;
						}
						if (v.drop) {
							$("#drop").show();
							canDropNum = v.drop;
						}
						if (v.take) {
							$("#take").show();
							canTakeNum = v.take;
						}
					});
					$(".step2").fadeIn(400);
				});
				$(".pkView").fadeIn(function() {
					$(".pkRow").append(getCardView(pk1p));
					$(".pkRow").append(getCardView(pk2p));

					$(".pkView .card:first-child").css({
						"left": (ww / 2 - 200) + "px",
						"top": "-200px",
					}).animate({
						"top": (cardTopNormal - 30) + "px"
					}, 200);

					$(".pkView .card:last-child").css({
						"left": (ww / 2 + 40) + "px",
						"top": "-200px",
					}).animate({
						"top": (cardTopNormal - 30) + "px"
					}, 200);

					$(".pkTitle").css({
						"top": (cardTopNormal - 100 < 1) ? 1 : cardTopNormal - 100 + "px"
					});
					setTimeout('$(".pkView .card").removeClass("hover");', 1000);
				});
				break;
			case "dice":
				alert("對方擲骰: " + data.message.split("::")[1]);
				break;
			case "newround":
				doNewRound();
				break;
			case "reset":
				render();
				reset();
				break;
			case "drop":
				dropNum = data.message.split("::")[1];
				status = "droping";
				$(".step2").hide();
				$(".step3").fadeIn();
				$("#dropOk").show().text("確定棄牌");
				$("#cardRow .card").addClass("hover");
				if (selection != undefined) {
					$(".card.selectedCard").removeClass("selectedCard").animate({
						"top": cardTopNormal + "px"
					}, 100, function() {
						doShowCard(null, false);
					});
					selection = undefined;
				}
				break;
			case "take":
				takeNum = data.message.split("::")[1];
				status = "taking";
				$(".step2").hide();
				$(".step3").fadeIn();
				$("#takeOk").show().text("確定奪牌");
				$("#cardRow .card").addClass("hover");
				if (selection != undefined) {
					$(".card.selectedCard").removeClass("selectedCard").animate({
						"top": cardTopNormal + "px"
					}, 100, function() {
						doShowCard(null, false);
					});
					selection = undefined;
				}
				break;
			case "get":
				var idx = data.message.split("::")[1];
				doGain(idx);
				break;
			case "additionalPlay":
				var idx = data.message.split("::")[1];
				$(".apTitle").css({
					"top": (cardTopNormal - 100 < 1) ? 1 : cardTopNormal - 100 + "px"
				})
				$(".additionalPlayView").fadeIn();
				$(".apRow").empty();
				$(".apRow").append(getCardView(idx));
				$(".apRow .card").css({
					"left": ((ww / 2) - 80) + "px",
					"top": "-200px"
				}).animate({
					"top": ((wh / 2) - 120) + "px"
				}, 200, function() {
					setTimeout("$('.apRow .card').removeClass('hover')");
				});
				break;
		}
	});
}

var render = function() {
	ww = $(window).width();
	wh = $(window).height();
	cardDeckW = ww - 120;
	cardSpacing = (cardDeckW - 280) / cardNum;
	cardTopNormal = (wh / 2) - 80;
	cardTopSelected = cardTopNormal - 70;

	var arh = wh * 0.08;
	$(".actionRow").css({
		"height": arh + "px",
		"line-height": arh + "px",
		"border-radius": (arh / 2) + "px"
	});

	if(ww < wh) {
		$(".mask").show();
	} else {
		$(".mask").hide();
	}
}

$(window).resize(function() {
	render();
});

var getCardView = function(idx, dealing) {
	var source = $("#card-template").html();
	var template = Handlebars.compile(source);
	var data = cards[idx];
	data.idx = idx;
	data.dealing = dealing;
	var html = template(data);
	return html;
}

var doDeal = function(n, idx) {
	if (n == undefined)
		n = 1;
	cardNum += n;

	for (var i = 0; i < n; i++) {
		if (idx == undefined)
			idx = Math.floor(Math.random() * cards.length);
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
		$("#cardRow").append(getCardView(idx, true));
	}

	$(".card").unbind("click").click(function(e) {
		var $target;
		if ($(e.target).hasClass("card"))
			$target = $(e.target);
		else
			$target = $(e.target).parents(".card");

		$(".card.selectedCard").animate({
			"top": cardTopNormal + "px"
		}, 100)
		if ($target.hasClass("selectedCard")) {
			$(".card").removeClass("selectedCard");
			selection = undefined;
		} else {
			$(".card").removeClass("selectedCard");
			$target.addClass("selectedCard").animate({
				"top": cardTopSelected + "px"
			}, 300);
			selection = $target;
		}
		doShowCard();
	});

	$(".dealing").animate({
		"top": cardTopNormal + "px"
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

	$.each($("#cardRow .card"), function(i, v) {
		var $v = $(v);
		if (lastIsSelected) {
			xCursor += 170 - cardSpacing;
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
		socket.emit("dice", {
			"player": player,
			"dice": $(".diceNumber").text()
		});
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
	roundEnd = false;
	$(".step2,.step3").fadeOut(function() {
		$(".step1").fadeIn();
	});
	$(".roundNumber").text(round);
	$(".roundView").fadeIn(function() {
		$(".roundView").animate({
			"top": "0"
		}, 1000, function() {
			$(".roundView").fadeOut(function() {
				doDeal();
				doSort();
				doShowCard(function() {
					setTimeout('$(".card").removeClass("hover")', 1000);
				});
			});
		})
	});
	additionalPlayType = undefined;
	additionalPlayNum = undefined;
}

var doDrop = function() {
	if (selection != undefined) {
		var $card = $(selection);
		$card.animate({
			"top": "-300px"
		}, 300, function() {
			var data = cards[$card.attr("data-idx")];
			switch (data.type) {
				case "attack":
					for (var i = 0; i < myAttackCard.length; i++) {
						if (myAttackCard[i].idx == data.idx) {
							myAttackCard.splice(i, 1);
						}
					}
					break;
				case "shield":
					for (var i = 0; i < myShieldCard.length; i++) {
						if (myShieldCard[i].idx == data.idx) {
							myShieldCard.splice(i, 1);
						}
					}
					break;
				case "move":
					for (var i = 0; i < myMoveCard.length; i++) {
						if (myMoveCard[i].idx == data.idx) {
							myMoveCard.splice(i, 1);
						}
					}
					break;
			}
			$card.remove();
			cardNum--;
			doShowCard();
			selection = undefined;
		});
	}
}

var doTake = function(idx) {
	socket.emit("get", {
		"player": player,
		"idx": $(selection).attr("data-idx")
	});
}

var doEnd = function() {
	$(".step2").fadeOut();
	socket.emit("end", {
		"player": player
	});
	roundEnd = true;
}

var doGain = function(idx) {
	doDeal(1, idx);
	doSort();
	doShowCard(function() {
		setTimeout('$(".card").removeClass("hover")', 1000);
	});
}