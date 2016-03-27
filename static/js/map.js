$(document).ready(function() {
	var $token;
	render();

	$(".token").click(function(e) {
		$token = $(e.target);
		if ($token.hasClass("selected")) {
			$token.removeClass("selected");
		} else {
			$token.addClass("selected");
		}
	});

	$(".map").click(function(e) {
		if ($token != undefined) {
			$token.removeClass("selected").animate({
				"top": (e.pageY - 15) + "px",
				"left": (e.pageX - 15) + "px",
			}, function() {
				$token = undefined;
			});
		}
	});
});

var render = function() {
	var ww = $(window).width();
	var wh = $(window).height();

	if (ww > wh) {
		$(".mask").show();
		$(".token").removeClass("hide").css({
			"width": (wh * 0.05) + "px",
			"height": (wh * 0.05) + "px",
		});
	} else {
		$(".mask").hide();
		$(".token").css({
			"width": (ww * 0.055) + "px",
			"height": (ww * 0.055) + "px",
		});
	}
}

$(window).resize(function() {
	render();
});