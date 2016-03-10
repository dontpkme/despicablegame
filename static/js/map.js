$(document).ready(function() {
	render();
});

var render = function() {
	var ww = $(window).width();
	var wh = $(window).height();

	if(ww > wh) {
		$(".mask").show();
	} else {
		$(".mask").hide();
	}
}

$(window).resize(function() {
	render();
});