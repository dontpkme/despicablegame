$(document).ready(function() {
	for (var i = 0; i < 6; i++) {
		$("#cardRow").append(getCardView(Math.floor(Math.random() * cards.length)));
	}
	render();
	$(".card").click(function(e) {
		var $target;
		if ($(e.target).hasClass("card"))
			$target = $(e.target);
		else
			$target = $(e.target).parents(".card");

		$(".card").removeClass("selectedCard");
		$target.addClass("selectedCard");
		render();
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
		}, 300);
	});
}

var getCardView = function(idx) {
	var source = $("#card-template").html();
	var template = Handlebars.compile(source);
	var html = template(cards[idx]);
	return html;
}

$(window).resize(function() {
	render();
});