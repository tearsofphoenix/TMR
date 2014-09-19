(function() {

    //node data looks like:
    //{d: 'data', t: <<TMRLevelTree>>}
    //
    var kTMRLevelNodeComparator = function(na, nb){
        var a = na.d, b = nb.d;
        return a > b ? 1 : (a == b ? 0 : - 1);
    };

    function TMRLevelTree(comp){

        comp = comp || kTMRLevelNodeComparator;
        RBTree.call(this, comp);
    }

    TMRInherit(TMRLevelTree, RBTree);

    TMRLevelTree.prototype.child = function(name) {

        var key = {d: name};
        var itr = this.findIter(key);
        if (itr) {
            return itr.node();
        }
        return null;
    };

    TMRLevelTree.prototype.insertData = function(data, tree) {
        return this.insert({d: data, t: tree});
    };

    TMRLevelTree.prototype.insertNewLevelUnderChild = function(name) {

        var newTree = null;
        var node = this.child(name);

        if (!node) {
            newTree = new TMRLevelTree();
            this.insert({d: name, t: newTree});
        }else{
            var oldData = node.data;
            if (oldData.t) {
                newTree = oldData.t;
            }else{
                newTree = new TMRLevelTree();
                node.data = {d: oldData.d, t: newTree};
            }
        }

        return newTree;
    };

    TMRLevelTree.prototype.findNodeByPaths = function(paths) {
        var tree = this;
        var node = null;
        var count = paths.length;
        for(var i = 0; i < count; ++i) {

            var key = paths[i];
            node = tree.child(key);

            if (count - 1 == i) { break; }

            if (node) {
                var t = node.data.t;
                if (t){  tree = t; }else{ return null; }
            }else{ return null; }
        }

        return node;
    };

    function TMRConnectTarget(url) {

        tmr_check_arg(url, 'string', true, 0);

        this._originURL = url;
        this._url = url;
        this._protocol = 'ws://';
        this._components = null;

        var idx = url.indexOf('://');
        if (idx != -1) {
            var endIdx = idx + '://'.length;
//            this._protocol = url.substr(0, endIdx);
            this._url = url.substr(endIdx);
        }

        this._components = this._url.split('/');
        this._domain = this._components[0];
    }

    TMRConnectTarget.prototype.isSecurity = function() {
        return this._protocol == 'wss://' || this._protocol == 'https://';
    };

    TMRConnectTarget.prototype.toString = function() {
        return this._originURL;
    };

    TMRConnectTarget.prototype.path = function() {
        return this._protocol + this._domain;
    };

    TMRConnectTarget.prototype.domain = function() {
        return this._domain;
    };

    function TMRConnection(name, address, observer) {

        if (address) {
            this._name = name;
            this._target = new TMRConnectTarget(address);
            this._sendBuffer = [];
            this._sentLength = 0;
            this._recvLength = 0;
            this._connected = false;
            this._imp = new WebSocket(this._target.path(), 'tmr-protocol');
            this._msgCallbacks = {};
            this._observer = observer;

            var dummy = this;
            this._imp.onopen = function(event) {

                console.log(dummy._name, 'websocket connected.');

                dummy._connected = true;
                dummy._flushSendBuffer();
            };

            this._imp.onclose = function(event) {
                tmr_log(event);
                dummy._connected = false;
            };

            this._imp.onmessage = function(event) {

                console.log(dummy._name, 'websocket received: ' + event.data);

                var info = JSON.parse(event.data);
                if (info) {
                    switch(info.action) {
                        case 'set': {

                            //noinspection JSDuplicatedDeclaration
                            var callback = dummy._msgCallbacks[info.o];
                            if (callback) {
                                callback(null);
                                delete dummy._msgCallbacks[info.o];
                            }
                            break;
                        }
                        case 'event': {
                            var tmrEvent = info.event;
                            tmr_log(tmrEvent);
                            var observers = dummy._msgCallbacks[tmrEvent];
                            observers.forEach(function(oLooper) {
                                //TODO
                                //
                                oLooper();
                            });

                            break;
                        }
                        //error occurs
                        //
                        case 'error': {
                            var callback = dummy._msgCallbacks[info.o];
                            if (callback) {
                                callback(new Error(info.error));
                                delete dummy._msgCallbacks[info.o];
                            }
                            break;
                        }
                        default : {
                            break;
                        }
                    }
                }
            };

            this._imp.onerror = function(event) {
                tmr_warning(event);
                dummy._connected = false;
            }

        }
    }

    TMRConnection.prototype._flushSendBuffer = function() {

        if(this._connected && this._sendBuffer.length > 0) {
            for (var i = 0; i < this._sendBuffer.length; ++i) {

                var pack = this._sendBuffer[i];
                var msg = pack.msg;
                this._sentLength += msg.length;

                msg = tmr_pack_message(msg, 16384);

                this._imp.send(String(msg.length));
                for (var b = 0; b < msg.length; b++) {
                    this._imp.send(msg[b])
                }
            }
        }
    };

    TMRConnection.prototype.setWithPriority = function(val, priority, callback) {
        if (!priority) {
            priority = tmr_encode_timestamp((new Date()).getTime());
        }

        if (callback) {
            var msgID = tmr_uuid();
            this._msgCallbacks[msgID] = callback;
        }

        //d: data, p: priority, o: observer
        //
        var pack = {d: JSON.stringify(val), p: priority, o: msgID};

        this._sendBuffer.push(pack);
        this._flushSendBuffer();
    };

    TMRConnection.prototype._observeOnEvent = function(event, callback) {
        var observers = this._msgCallbacks[event];
        if (!observers) {
            observers = [];
            this._msgCallbacks[event] = observers;
        }

        observers.push(callback);
    };

    function TMRImp(a, b) {
        if (arguments.length == 2) {
            this._connection = a;
            this._path = b;
        } else {
            var address = a;
            this._connection = new TMRConnection('TMR', address, this);
            this._path = new TMRPath(address);
        }
    }

    //we share the connection with our copy
    //
    TMRImp.prototype.copy = function() {
        return new TMRImp(this._connection, this._path);
    };

    TMRImp.prototype._connectToServer = function() {
        this._connection.send({action: 'collection', name: 'TMR'});
    };

    TMRImp.prototype._dispatchInfo = function(info) {

        var error = info.error;
        var msgID = info.msgID;
        var action = info.action;

        switch(action) {
            case 'set': {
                 break;
            }
            case 'value': {

                break;
            }
            case 'child_added': {
                break;
            }
            case 'child_changed': {
                break;
            }
            case 'child_removed': {
                break;
            }
            case 'child_moved': {
                break;
            }
            default : {
                break;
            }
        }
    };

    TMRImp.prototype.auth = function(authToken, completion, cancelCallback) {
        //TODO;
    };

    TMRImp.prototype.unauth = function() {

    };

    TMRImp.prototype.child = function() {

    };

    TMRImp.prototype.parent = function() {

    };

    TMRImp.prototype.root = function() {

    };

    TMRImp.prototype.name = function() {

    };

    TMRImp.prototype.toString = function() {
        return this._address;
    };

    TMRImp.prototype.update = function(value, completion) {

    };

    TMRImp.prototype.push = function(value, completion) {

    };

    TMRImp.prototype.setWithPriority = function(value, priority, completion) {
        this._connection.setWithPriority(value, priority, completion);
    };

    TMRImp.prototype.setPriority = function(priority, completion) {

    };

    TMRImp.prototype.transaction = function(updateFunction, completion, applyLocally) {

    };

    TMRImp.prototype.goOffLine = function() {

    };

    TMRImp.prototype.goOnLine = function() {

    };

    //Query
    TMRImp.prototype.on = function(eventType, callback, cancelCallback, context) {


        return callback;
    };

    TMRImp.prototype.off = function(eventType, callback, context) {

    };

    TMRImp.prototype.once = function(eventType, successCallback, failureCallback, context) {

    };

    TMRImp.prototype.limit = function(limit) {

    };

    TMRImp.prototype.startAt = function(priority, name) {

    };

    TMRImp.prototype.endAt = function(priority, name) {

    };

    TMRImp.prototype.ref = function() {

    };

    function TMR(address) {
        this._imp = new TMRImp(address);
	};

	TMR.prototype.auth = function(authToken, completion, cancelCallback) {

        this._imp.auth(authToken, completion, cancelCallback);
	};
	
	TMR.prototype.unauth = function() {
		this._imp.unauth();
	};
	
	TMR.prototype.child = function() {
		return this._imp.child();
	};
		
	TMR.prototype.parent = function() {
		return this._imp.parent();
	};

	TMR.prototype.root = function() {
		return this._imp.root();
	};

	TMR.prototype.name = function() {
		return this._imp.name();
	};

	TMR.prototype.toString = function() {
        return this._imp.toString();
	};
	
	TMR.prototype.set = function(value, completion) {
        this._imp.setWithPriority(value, null, completion);
	};
	
	TMR.prototype.update = function(value, completion) {
        this._imp.update(value, completion);
	};
	
	TMR.prototype.remove = function(completion) {
		this._imp.set(null, completion);
	};

	TMR.prototype.push = function(value, completion) {
		this._imp.push(value, completion);
	};
	
	TMR.prototype.setWithPriority = function(value, priority, completion) {
		this._imp.setWithPriority(value, priority, completion);
	};
	
	TMR.prototype.setPriority = function(priority, completion) {
		this._imp.setPriority(priority, completion);
	};
	
	TMR.prototype.transaction = function(updateFunction, completion, applyLocally) {
		this._imp.transaction(updateFunction, completion, applyLocally);
	};
	
	TMR.prototype.goOffLine = function() {
		this._imp.goOffLine();
	};
	
	TMR.prototype.goOnLine = function() {
		this._imp.goOnLine();
	};
	
	//Query
	TMR.prototype.on = function(eventType, callback, cancelCallback, context) {
        tmr_check_event_type(eventType);
		return this._imp.on(eventType, callback, cancelCallback, context);
	};

	TMR.prototype.off = function(eventType, callback, context) {
        tmr_check_event_type(eventType);
		return this._imp.off(eventType, callback, context);
	};

	TMR.prototype.once = function(eventType, successCallback, failureCallback, context) {
        tmr_check_event_type(eventType);
		return this._imp.once(eventType, successCallback, failureCallback, context);
	};

	TMR.prototype.limit = function(limit) {
		return this._imp.limit(limit);
	};

	TMR.prototype.startAt = function(priority, name) {
		return this._imp.startAt(priority, name);
	};

	TMR.prototype.endAt = function(priority, name) {
		return this._imp.endAt(priority, name);
	};
	
	TMR.prototype.ref = function() {
		return this._imp.ref();
	};

    window.TMR = TMR;
    window.TMRLevelTree = TMRLevelTree;
    window.tmr_typename = tmr_typename;
    window.tmr_encode_timestamp = tmr_encode_timestamp;
})();
