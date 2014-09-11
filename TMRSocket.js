(function() {

	function packMessage(msg, blockLength) {
		if (msg.length <= blockLength) return [msg];
		for (var c = [], d = 0; d < msg.length; d += blockLength) d + blockLength > msg ? c.push(msg.substring(d, msg.length)) : c.push(msg.substring(d, d + blockLength));
		return c
	}
	
	var UUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
						var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
						return v.toString(16);
    				});
	} 


	TMRSocket = function (name, address) {
	
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
			var dummy = this;
			this._socket.onopen = function(event) { 
			
				console.log(dummy._name, 'websocket connected.');
				
				dummy._connected = true;
				dummy._flushSendBuffer();
			} 
			
			this._socket.onclose = function(event) {
				dummy._connected = false;
				
			} 
			 
			this._socket.onmessage = function(event) { 
				console.log(dummy._name, 'websocket received: ' + event.data);
				var info = JSON.parse(event.data);
				if (info) {
					if(info.status == 0) {}
				}
			} 
			
			this._socket.onerror = function(event) { 
				dummy._connected = false;
			} 
			
		}
	}
	
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
	}
	
	TMRSocket.prototype.send = function(msg, callback) {
		var msgID = UUID();
		var pack = {msg: JSON.stringify(msg), msgID: msgID};
		
		this._msgCallbacks[msgID] = callback;
		this._sendBuffer.push(pack);
		this._flushSendBuffer();
	}
})();
