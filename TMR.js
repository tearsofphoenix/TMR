(function() {
	TMR = function (address) {
		this._socket = new TMRSocket('TMR', address);
	}
	
	TMR.prototype.auth = function(authToken, completion, cancelCallback) {
		//TODO;
	}
	
	TMR.prototype.unauth = function() {
		
	}		
	
	TMR.prototype.child = function() {
		
	}	
		
	TMR.prototype.parent = function() {
		
	}		

	TMR.prototype.root = function() {
		
	}		

	TMR.prototype.name = function() {
		
	}		

	TMR.prototype.toString = function() {
		return this._address;
	}
	
	TMR.prototype.set = function(value, completion) {

		this._socket.send(JSON.stringify(value), completion);
	}
	
	TMR.prototype.update = function(value, completion) {
		
	}
	
	TMR.prototype.remove = function(completion) {
		
	}

	TMR.prototype.push = function(value, completion) {
		
	}
	
	TMR.prototype.setWithPriority = function(value, priority, completion) {
		
	}
	
	TMR.prototype.setPriority = function(priority, completion) {
		
	}
	
	TMR.prototype.transaction = function(updateFunction, completion, applyLocally) {
		
	}
	
	TMR.prototype.goOffLine = function() {
		
	}
	
	TMR.prototype.goOnLine = function() {
		
	}
	
	//Query
	TMR.prototype.on = function(eventType, callback, cancelCallback, context) {
		
	}

	TMR.prototype.off = function(eventType, callback, context) {
		
	}

	TMR.prototype.once = function(eventType, successCallback, failureCallback, context) {
		
	}

	TMR.prototype.limit = function(limit) {
		
	}

	TMR.prototype.startAt = function(priority, name) {
		
	}

	TMR.prototype.endAt = function(priority, name) {
		
	}
	
	TMR.prototype.ref = function() {
		
	}	

})();
