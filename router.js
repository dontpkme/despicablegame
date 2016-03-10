var util = require("./util.js");
var requestHandlers = require("./requestHandlers.js");

var handler = {
	"GET": {},
	"POST": {},
	"PUT": {},
	"DELETE": {},
	"OPTIONS": {}
};

handler["GET"]["/"] = requestHandlers.index;
handler["GET"]["/map"] = requestHandlers.map;
handler["GET"].defaultHandler = requestHandlers.returnFile;

handler["POST"].defaultHandler = requestHandlers.returnFile;

handler["PUT"].defaultHandler = requestHandlers.returnFile;

handler["DELETE"].defaultHandler = requestHandlers.returnFile;

handler["OPTIONS"].defaultHandler = requestHandlers.returnFile;

var route = function(method, request, response) {
	var path = util.getPathname(request);
	try {
		if (typeof handler[method][path] === 'function') {
			handler[method][path](request, response);
		} else {
			handler[method].defaultHandler(request, response);
		}
	} catch (e) {
		console.trace(e.stack);
		util.initTextResponse(response, 'oops! something wrong.', 400);
	}
}

exports.route = route;