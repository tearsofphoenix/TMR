(function() {
	 var socket = new TMRSocket('iOS', 'localhost:8080');
	 console.log(socket);
	 socket.send('info');
	 
})();