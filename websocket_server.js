#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('tmr-protocol', request.origin);
    
    connection._data = [];
    connection._count = 0;
    
    console.log((new Date()) + ' Connection accepted.');
    
    connection.on('message', function(message) {
    
    	var data = message.utf8Data;
    	if (this._count == 0) {
	    	this._count = parseInt(data);
	    	if (0 == this._count){
		    	throw Error('Invalid data length');
	    	}
    	}else{
	    	this._data.push(data);
	    	if (this._data.length == this._count) {
		    	//have received all data
		    	//
		    	var msg = this._data.join('');
				console.log('recived message: ' + data);
				this.sendUTF(data);
				
				this._count = 0;
				this._data = [];
	    	}
    	}
    });
    
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});