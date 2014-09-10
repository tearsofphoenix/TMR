function Service() {
	this._info = {}
}
Service.prototype.set = function(a, b) {
	null == b ? delete this._info[a] : this._info[a] = b
};
Service.prototype.get = function(a) {
	var obj = this._info[a];
	return obj ? obj : null;
};
Service.prototype.remove = function(a) {
	delete this._info[a]
};
	
   function _cloneObject(a) {
        var b = {},
            c;
        for (c in a) b[c] = a[c];
        return b
    };

	function fb_assert(e, msg) {
		if (!e) throw Error("Firebase INTERNAL ASSERT FAILED:" + msg);
	}
	
    function SocketInfo() {
        this.pb = {}
    }

    SocketInfo.prototype.get = function() {
        return _cloneObject(this.pb)
    };
    
	function Bc(a, b, c) {	
		a.pb[b] += c
	}
	
	function packMessage(msg, blockLength) {
		if (msg.length <= blockLength) return [msg];
		for (var c = [], d = 0; d < msg.length; d += blockLength) d + blockLength > msg ? c.push(msg.substring(d, msg.length)) : c.push(msg.substring(d, d + blockLength));
		return c
	}
	
    var Ec = {},
        Fc = {};

    function _createInfoSlot(a) {
        a = a.toString();
        Ec[a] || (Ec[a] = new SocketInfo);
        return Ec[a]
    }
    
    var  FB_ENABLE_LOG = !0;

    function _defaultLogger(a) {

        if (FB_ENABLE_LOG) {
        	var args = [];
        	var originArguments = arguments[1];
        	for (var i=0; i<originArguments.length; ++i) {
	        	args.push(originArguments[i]);
        	}
        	var str = args.join(' ');
			console.log(a + str);
        }
    }

    function _createLogger(a) {
        return function() {
            _defaultLogger(a, arguments)
        }
    }
    
    
    var WebSocketIMP = null;
    "undefined" !== typeof MozWebSocket ? WebSocketIMP = MozWebSocket : "undefined" !== typeof WebSocket && (WebSocketIMP = WebSocket);

    function FirebaseSocket(logPrefix, url) {
        this._logPrefix = logPrefix;
        this._logger = _createLogger(this._logPrefix);
        this.frames = this.vb = null;
        this._infoSlot = _createInfoSlot(url);
        this._url = url;
        this._receivedLength = 0;
        this._sentLength = 0;
    }
    
    FirebaseSocket.prototype.open = function(messageCallback, closeCallback) {
        this._closeCallback = closeCallback;
        this._msgCallback = messageCallback;
        this._logger("Websocket connecting to " + this._url);
        this._imp = new WebSocketIMP(this._url, 'tmr-protocol');
        this._connected = false;
        
        var c = this;
        this._imp.onopen = function() {
            c._logger("Websocket connected.");
            c._connected = true
            c._imp.send('hello');
        };
        this._imp.onclose = function() {
            c._logger("Websocket connection was disconnected.");
            c._imp = null;
            c.Pa()
        };
        this._imp.onmessage = function(a) {
            if (null !== c.W){ 

            	if (a = a.data, c._receivedLength += a.length, Bc(c._infoSlot, "bytes_received", a.length), Kc(c), null !== c.frames){
					Lc(c, a);					
				}else {
	                a: {
	                    fb_assert(null === c.frames, "We already have a frame buffer");
	                    if (6 >= a.length) {
	                        var b = Number(a);
	                        if (!isNaN(b)) {
	                            c.ad = b;
	                            c.frames = [];
	                            a = null;
	                            break a
	                        }
	                    }
	                    c.ad = 1;
	                    c.frames = []
	                }
	                null !== a && Lc(c, a)
	            }
            }
        };
        this._imp.onerror = function(a) {
            c._logger("WebSocket error.  Closing connection.");
            (a = a.message || a.data) && c.e(a);
            c.Pa()
        }
    };

    FirebaseSocket.prototype.start = function() {};
    FirebaseSocket.isAvailable = function() {
        var a = false;
        if ("undefined" !== typeof navigator && navigator.userAgent) {
            var b = navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);
            b && 1 < b.length && 4.4 > parseFloat(b[1]) && (a = true)
        }
        return !a && null !== WebSocketIMP
    };

    FirebaseSocket.responsesRequiredToBeHealthy = 2;
    FirebaseSocket.healthyTimeout = 3E4;
    
    function Lc(a, b) {
        a.frames.push(b);
        if (a.frames.length == a.ad) {
            var c = a.frames.join("");
            a.frames = null;
            c = JSON.parse(c);
            a._msgCallback(c)
        }
    }
    FirebaseSocket.prototype.send = function(a) {
        Kc(this);
        a = JSON.stringify(a);
        this._sentLength += a.length;
        
        Bc(this._infoSlot, "bytes_sent", a.length);
        
        a = packMessage(a, 16384);
        1 < a.length && this._imp.send(String(a.length));
        for (var b = 0; b < a.length; b++) this._imp.send(a[b])
    };
    FirebaseSocket.prototype._clearUp = function() {
        this._hasCleared = !0;
        this._intervalID && (clearInterval(this._intervalID), this._intervalID = null);
        this._imp && (this._imp.close(), this._imp = null)
    };
    FirebaseSocket.prototype.Pa = function() {
        this._hasCleared || (this._logger("WebSocket is closing itself"), this._clearUp(), this._closeCallback && (this._closeCallback(this._connected), this._closeCallback = null))
    };
    FirebaseSocket.prototype.close = function() {
        this._hasCleared || (this._logger("WebSocket is being closed"), this._clearUp())
    };

    function Kc(firebaseSocket) {
        
        clearInterval(firebaseSocket._intervalID);

        firebaseSocket._intervalID = setInterval(function() {

            firebaseSocket.W && firebaseSocket.W.send("0");
            Kc(firebaseSocket)

        }, Math.floor(45E3))
    };