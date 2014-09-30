#!/usr/bin/env node

(function() {


//@return string
    function UUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };


    var TMRCollectionPool = {};

    function TMRServer() {

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

        this._socketServer =  new WebSocketServer({
            httpServer: server,
            autoAcceptConnections: false
        });

        //create db connection
        var Db = require('mongodb').Db, Connection = require('mongodb').Connection,
            Server = require('mongodb').Server;

        this._client = new Db('test', new Server("127.0.0.1", 27017, {}), {safe: false});
        this._client.open(function(err, client) {
            /*   client.collection('test_insert', test); */
        });

        var dummyServer = this;
        this._socketServer.on('request', function(request) {
            if (!dummyServer.originIsAllowed(request.origin)) {
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
                console.log(data);
                if (connection._count == 0) {
                    connection._count = parseInt(data);
                    if (0 == connection._count){
                        throw Error('Invalid data length');
                    }
                }else{
                    connection._data.push(data);
                    if (connection._data.length == connection._count) {
                        //have received all data
                        //
                        var msg = connection._data.join('');
                        var info = JSON.parse(msg);
                        console.log('recived message: ' + msg);
                        if (info) {
                            switch(info.action) {
                                case 'insert': {
                                    connection.insert(info.data, function(error, docs) {
                                        if (error) {
                                            console.log(error);
                                            dummyServer._socketServer.sendUTF(error.toString());
                                        }
                                    });
                                    break;
                                }
                                case 'collection': {
                                    client.collection(info.name, function(error, collection) {
                                        if(error) {
                                            dummyServer._socketServer.sendUTF(JSON.stringify({status: -1, error: error.toString(), msg: msg, msgID: info.msgID}) );
                                        }else{
                                            var uuid = UUID();
                                            TMRCollectionPool[uuid] = collection;
                                            dummyServer._socketServer.sendUTF(JSON.stringify({status: 0, uuid: uuid, msgID: info.msgID }));
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

                        connection._count = 0;
                        connection._data = [];
                    }
                }
            });

            connection.on('close', function(reasonCode, description) {
                console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            });
        });
    }

    TMRServer.prototype.originIsAllowed = function(origin) {
        console.log(origin);
        return true;
    };

    return new TMRServer();
})();
