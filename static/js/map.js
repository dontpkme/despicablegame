$(document).ready(function() {
	render();
});

var render = function() {
	var ww = $(window).width();
	var wh = $(window).height();
	var $token;

	if (ww > wh) {
		$(".mask").show();
		$(".token").removeClass("hide");
	} else {
		$(".mask").hide();
	}

	$(".token").click(function(e) {
		$token = $(this);
		$(this).addClass("selected");
	});

	$(".map").click(function(e) {
		$token.removeClass("selected").animate({
			"top": (e.pageY - 15) + "px",
			"left": (e.pageX - 15) + "px",
		});
	});
}

$(window).resize(function() {
	render();
});