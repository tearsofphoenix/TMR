
   function _cloneObject(a) {
        var b = {},
            c;
        for (c in a) b[c] = a[c];
        return b
    };

    function SocketInfo() {
        this.pb = {}
    }

    SocketInfo.prototype.get = function() {
        return _cloneObject(this.pb)
    };
    
    var Ec = {},
        Fc = {};

    function _createInfoSlot(a) {
        a = a.toString();
        Ec[a] || (Ec[a] = new Ac);
        return Ec[a]
    }
    
    var  FB_ENABLE_LOG = !0;

    function _defaultLogger(a) {

        if (FB_ENABLE_LOG) {
			console.log(a);
        }
    }

    function _createLogger(a) {
        return function() {
            _defaultLogger(a, arguments)
        }
    }
    
    
    var WebSocketIMP = null;
    "undefined" !== typeof MozWebSocket ? WebSocketIMP = MozWebSocket : "undefined" !== typeof WebSocket && (WebSocketIMP = WebSocket);

    function FirebaseSocket(a, b, c) {
        this._logPrefix = a;
        this._logger = _createLogger(this._logPrefix);
        this.frames = this.vb = null;
        this.Ha = this.Ia = this.ad = 0;
        this.ea = _createInfoSlot(b);
        this.Wa = (b.qc ? "wss://" : "ws://") + b.ga + "/.ws?v=5";
        b.host !== b.ga && (this.Wa = this.Wa + "&ns=" + b.bc);
        c && (this.Wa = this.Wa + "&s=" + c)
    }
    
    var Jc;

    FirebaseSocket.prototype.open = function(a, b) {
        this.ia = b;
        this.Wd = a;
        this._logger("Websocket connecting to " + this.Wa);
        this.W = new WebSocketIMP(this.Wa);
        this._status = !1;
        nb.set("previous_websocket_failure", !0);
        var c = this;
        this.W.onopen = function() {
            c.e("Websocket connected.");
            c._status = !0
        };
        this.W.onclose = function() {
            c.e("Websocket connection was disconnected.");
            c.W = null;
            c.Pa()
        };
        this.W.onmessage = function(a) {
            if (null !== c.W) if (a = a.data, c.Ha += a.length, Bc(c.ea, "bytes_received", a.length), Kc(c), null !== c.frames) Lc(c, a);
            else {
                a: {
                    v(null === c.frames, "We already have a frame buffer");
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
        };
        this.W.onerror = function(a) {
            c.e("WebSocket error.  Closing connection.");
            (a = a.message || a.data) && c.e(a);
            c.Pa()
        }
    };

    FirebaseSocket.prototype.start = function() {};
    FirebaseSocket.isAvailable = function() {
        var a = !1;
        if ("undefined" !== typeof navigator && navigator.userAgent) {
            var b = navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);
            b && 1 < b.length && 4.4 > parseFloat(b[1]) && (a = !0)
        }
        return !a && null !== WebSocketIMP && !Jc
    };

    FirebaseSocket.responsesRequiredToBeHealthy = 2;
    FirebaseSocket.healthyTimeout = 3E4;
    
    FirebaseSocket.prototype.$b = function() {
        nb.remove("previous_websocket_failure")
    };

    function Lc(a, b) {
        a.frames.push(b);
        if (a.frames.length == a.ad) {
            var c = a.frames.join("");
            a.frames = null;
            c = ra(c);
            a.Wd(c)
        }
    }
    FirebaseSocket.prototype.send = function(a) {
        Kc(this);
        a = u(a);
        this.Ia += a.length;
        Bc(this.ea, "bytes_sent", a.length);
        a = ac(a, 16384);
        1 < a.length && this.W.send(String(a.length));
        for (var b = 0; b < a.length; b++) this.W.send(a[b])
    };
    FirebaseSocket.prototype._clearUp = function() {
        this._hasCleared = !0;
        this._intervalID && (clearInterval(this._intervalID), this._intervalID = null);
        this.W && (this.W.close(), this.W = null)
    };
    FirebaseSocket.prototype.Pa = function() {
        this._hasCleared || (this._logger("WebSocket is closing itself"), this._clearUp(), this.ia && (this.ia(this._status), this.ia = null))
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