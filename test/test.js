(function() {
    var timestamp = (new Date()).getTime();
    console.log(tmr_encode_timestamp(timestamp));

    var tmr = new TMR('http://127.0.0.1/data');
    console.log(tmr);
    tmr.set({a : 'hello world!'}, function(error) {
        console.log(error);
    })
})();