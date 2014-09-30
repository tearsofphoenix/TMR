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

//@return String
var UUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
						var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
						return v.toString(16);
    				});
	} 

var Db = require('mongodb').Db, Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;

//var client = new Db('nodejs', new Server("127.6.149.2", 27017, {}), {safe: true});
var client = new Db('nodejs', new Server("127.0.0.1", 27017, {}), {safe: true});
client.open(function(err, client) {
    if (client) {
        var tmr = client.collection('tmr');
        tmr.insert({hello: 1}, function(err, result) {
            console.log(err, result);
        })
    }else{
        console.log(err);
    }
});

var TMRCollectionPool = {};

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
		    	var info = JSON.parse(msg);
				console.log('recived message: ' + msg);
				var dummy = this;

		    	if (info) {
			    	switch(info.action) {
				    	case 'insert': {
				    		connection.insert(info.data, function(error, docs) {
					    		if (error) {
						    		console.log(error);
						    		dummy.sendUTF(error.toString());
					    		}
				    		});
					    	break;
				    	}
				    	case 'collection': {
							client.collection(info.name, function(error, collection) {
								if(error) {
									dummy.sendUTF(JSON.stringify({status: -1, error: error.toString(), msg: msg, msgID: info.msgID}) );
								}else{
									var uuid = UUID();
									TMRCollectionPool[uuid] = collection;
									dummy.sendUTF(JSON.stringify({status: 0, uuid: uuid, msgID: info.msgID }));
								}
							});				    	
					    	break;
				    	}
				    	default: {
					    	break;
				    	}
			    	}
		    	}
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