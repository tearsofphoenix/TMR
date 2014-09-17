(function() {

    var tmr_encode_timestamp = function () {
        var a = 0, b = [];
        return function (c) {
            var d = c === a;
            a = c;
            for (var e = Array(8), f = 7; 0 <= f; f--)e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64), c = Math.floor(c / 64);
            tmr_assert(0 === c, "Cannot push at time == 0");
            c = e.join("");
            if (d) {
                for (f = 11; 0 <= f && 63 === b[f]; f--)b[f] = 0;
                b[f]++
            } else for (f = 0; 12 > f; f++)b[f] = Math.floor(64 * Math.random());
            for (f = 0; 12 > f; f++)c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
            tmr_assert(20 === c.length, "NextPushId: Length should be 20.");
            return c
        }
    }();

    function tmr_typename(a) {
        var b = typeof a;
        if ("object" == b)if (a) {
            if (a instanceof Array) return"array";
            if (a instanceof Object) return b;
            var c = Object.prototype.toString.call(a);
            if ("[object Window]" == c)return"object";
            if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice"))return"array";
            if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call"))return"function"
        } else return"null";
        else if ("function" == b && "undefined" == typeof a.call) return"object";
        return b
    }

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

    function tmr_assert(a, msg) {
        if (!(a)){ tmr_throw_error(msg ? msg : 'Expression should be true!') }
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

    function TMRInherit(Self, Super) {
        function c() {
        }

        c.prototype = Super.prototype;
        Self.me = Super.prototype;
        Self.prototype = new c;
        Self.super = function (a, c, f) {
            return Super.prototype[c].apply(a, Array.prototype.slice.call(arguments, 2))
        }
    };

    function TMRConnection(name, address, observer) {

        if (address) {
            this._name = name;
            this._target = new TMRConnectTarget(address);
            this._sendBuffer = [];
            this._sentLength = 0;
            this._recvLength = 0;
            this._connected = false;
            this._imp = new WebSocket(this._target.domain(), 'tmr-protocol');
            this._msgCallbacks = {};
            this._observer = observer;

            var dummy = this;
            this._imp.onopen = function(event) {

                console.log(dummy._name, 'websocket connected.');

                dummy._connected = true;
                dummy._flushSendBuffer();
            };

            this._imp.onclose = function(event) {
                dummy._connected = false;

            };

            this._imp.onmessage = function(event) {

                console.log(dummy._name, 'websocket received: ' + event.data);

                var info = JSON.parse(event.data);
                if (info) {
                    this._observer._dispatchInfo(info);
                }
            };

            this._imp.onerror = function(event) {
                dummy._connected = false;
            }

        }
    };

    TMRConnection.prototype._flushSendBuffer = function() {

        if(this._connected && this._sendBuffer.length > 0) {
            for (var i = 0; i < this._sendBuffer.length; ++i) {

                var pack = this._sendBuffer[i];
                var msg = pack.msg;
                this._sentLength += msg.length;

                msg = packMessage(msg, 16384);

                this._imp.send(String(msg.length));
                for (var b = 0; b < msg.length; b++) {
                    this._imp.send(msg[b])
                }
            }
        }
    };

    TMRConnection.prototype.send = function(msg, callback) {
        var msgID = UUID();
        var pack = {msg: JSON.stringify(msg), msgID: msgID};

        this._msgCallbacks[msgID] = callback;
        this._sendBuffer.push(pack);
        this._flushSendBuffer();
    };

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

        this._originURL = url;
        this._url = url;
        this._protocol = 'ws://';
        this._components = null;

        if (idx != -1) {
            var endIdx = idx + '://'.length;
            this._protocol = url.substr(0, endIdx);
            this._url = url.substr(endIdx);
        }
        this._components = url.split('/');
        this._domain = this._components[0];
        this._path = this._protocol + this._url;
    }

    TMRConnectTarget.prototype.isSecurity = function() {
        return this._protocol == 'wss://' || this._protocol == 'https://';
    };

    TMRConnectTarget.prototype.toString = function() {
        return this._originURL;
    };

    TMRConnectTarget.prototype.domain = function() {
        return this._domain;
    };

    function TMRImp(address) {
        this._connection = new TMRConnection('TMR', address, this);
        this._connectToServer();
        this._queryObservers = {};
    }

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
        this._connection.send(JSON.stringify(value), completion);
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
        var query = new TMRQueryImp(this, false, eventType, callback, cancelCallback, context);

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
