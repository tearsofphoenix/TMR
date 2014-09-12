(function() {

    function tmr_log(msg) {
        var logger = console ? (console.log ? console.log : null) : null;
        if (logger) { logger(msg) }
    }

    function tmr_warning(msg) {
        var logger = console ? (console.warn ? console.warn : null) : null;
        if (logger) { logger(msg) }
    }

    function tmr_throw_error(msg) {
        throw Error(msg);
    }

    function tmr_check_event_type(type) {
        switch (type) {
            case 'value':
            case 'child_added':
            case 'child_changed':
            case 'child_removed':
            case 'child_moved': {
                break;
            }
            default : {
                tmr_throw_error('Event type must be "value", "child_added", "child_changed", "child_removed", or "child_moved."!');
            }
        }
    }

    function packMessage(msg, blockLength) {
        if (msg.length <= blockLength) return [msg];
        for (var c = [], d = 0; d < msg.length; d += blockLength) d + blockLength > msg ? c.push(msg.substring(d, msg.length)) : c.push(msg.substring(d, d + blockLength));
        return c
    }

    function UUID () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };


     function TMRSocket(name, address) {

        if (address) {
            this._name = name;
            this._address = address;
            this._socketAddress = 'ws://' + address;
            this._sendBuffer = [];
            this._sentLength = 0;
            this._recvLength = 0;
            this._connected = false;
            this._socket = new WebSocket(this._socketAddress, 'tmr-protocol');
            this._msgCallbacks = {};
            this._observers = {};

            var dummy = this;
            this._socket.onopen = function(event) {

                console.log(dummy._name, 'websocket connected.');

                dummy._connected = true;
                dummy._flushSendBuffer();
            };

            this._socket.onclose = function(event) {
                dummy._connected = false;

            };

            this._socket.onmessage = function(event) {

                console.log(dummy._name, 'websocket received: ' + event.data);

                var info = JSON.parse(event.data);
                if (info) {
                    var error = info.error;
                    var msgID = info.msgID;
                    var action = info.action;

                    switch(action) {
                        case 'set': {
                            var msgCallback = dummy._msgCallbacks[msgID];

                            if (msgCallback) {
                                msgCallback(error ? error : null);
                            }
                            break;
                        }
                        case 'value': {
                            var observers = dummy._observers[action];
                            if (observers && observers.length > 0) {
                                if (error) {
                                    observers.forEach(function(vLooper) {
                                        vLooper._triggerCallback(info);
                                    })
                                }else{
                                    observers.forEach(function(vLooper) {
                                        vLooper._triggerCancelCallback(info);
                                    })
                                }
                            }

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
                }
            };

            this._socket.onerror = function(event) {
                dummy._connected = false;
            }

        }
    };

    TMRSocket.prototype._addObserver = function(observer, key) {

        var observers = this._observers[key];
        if (!observers) {
            observers = [];
            this._observers[key] = observers;
        }

        observers.push(observer);
    };

    TMRSocket.prototype._flushSendBuffer = function() {

        if(this._connected && this._sendBuffer.length > 0) {
            for (var i = 0; i < this._sendBuffer.length; ++i) {

                var pack = this._sendBuffer[i];
                var msg = pack.msg;
                this._sentLength += msg.length;

                msg = packMessage(msg, 16384);

                this._socket.send(String(msg.length));
                for (var b = 0; b < msg.length; b++) {
                    this._socket.send(msg[b])
                }
            }
        }
    };

    TMRSocket.prototype.send = function(msg, callback) {
        var msgID = UUID();
        var pack = {msg: JSON.stringify(msg), msgID: msgID};

        this._msgCallbacks[msgID] = callback;
        this._sendBuffer.push(pack);
        this._flushSendBuffer();
    };

    function TMRNode(parent){
        this._parent = parent;
        this._children = [];
    };

    function TMRQueryImp(tmr, callback, cancelCallback, context) {
        this._ref = tmr;
        this._updateSettings(callback, cancelCallback, context);
    };

    TMRQueryImp.prototype._updateSettings = function(eventType, callback, cancelCallback, context) {
        this._callback = callback;
        this._cancelCallback = cancelCallback;
        this._context = context;
    };

    TMRQueryImp.prototype._triggerCallback = function(info) {
        this._callback(info, this._context);
    };

    TMRQueryImp.prototype._triggerCancelCallback = function(info){
        this._cancelCallback(info, this._context);
    };

    TMRQueryImp.prototype.off = function(eventType, callback, context) {

    };

    TMRQueryImp.prototype.once = function(eventType, successCallback, failureCallback, context) {

    };

    TMRQueryImp.prototype.limit = function(limit) {

    };

    TMRQueryImp.prototype.startAt = function(priority, name) {

    };

    TMRQueryImp.prototype.endAt = function(priority, name) {

    };

    TMRQueryImp.prototype.ref = function() {

    };


    function TMRImp(address) {
        this._socket = new TMRSocket('TMR', address);
        this._socket.send({action: 'collection', name: 'TMR'});
        this._queryObservers = {};
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

    TMRImp.prototype.set = function(value, completion) {

        this._socket.send(JSON.stringify(value), completion);
    };

    TMRImp.prototype.update = function(value, completion) {

    };

    TMRImp.prototype.remove = function(completion) {

    };

    TMRImp.prototype.push = function(value, completion) {

    };

    TMRImp.prototype.setWithPriority = function(value, priority, completion) {

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

        var queries = this._queryObservers[eventType];
        var query = new TMRQueryImp(this, eventType, callback, cancelCallback, context);

        if (!queries) {
            queries = [];
            this._queryObservers[eventType] = queries;
        }

        queries.push(query);

        return callback;
    };

    TMRImp.prototype.off = function(eventType, callback, context) {
        if(eventType) {
            var queries = this._queryObservers[eventType];
            if (queries && queries.length > 0) {
                queries.pop();
            }else{
                tmr_log('Will off an event: ' + eventType + ' whose observer not exist!');
            }
        }else{
            //off all event

        }
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

    TMR = function (address) {
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
        this._imp.set(value, completion);
	};
	
	TMR.prototype.update = function(value, completion) {
        this._imp.update(value, completion);
	};
	
	TMR.prototype.remove = function(completion) {
		this._imp.remove(completion);
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
	}	

})();
