(function() {
//	 var tmr = new TMR('localhost:8080');
//	 console.log(tmr);
//	 tmr.set({a : 'info'});
    function isNumber(a) {
        return"number" == typeof a
    }

    function isInfinityNumber(a) {
        return isNumber(a) && (a != a || a == Number.POSITIVE_INFINITY || a == Number.NEGATIVE_INFINITY)
    }

    function fb_assert(a, b) {
        if (!a)throw Error("Firebase INTERNAL ASSERT FAILED:" + b);
    }

    function ec(a) {
        fb_assert(!isInfinityNumber(a), "Invalid JSON number");
        var b, c, d, e;
        0 === a ? (d = c = 0, b = -Infinity === 1 / a ? 1 : 0) : (b = 0 > a, a = Math.abs(a), a >= Math.pow(2, -1022) ? (d = Math.min(Math.floor(Math.log(a) / Math.LN2), 1023), c = d + 1023, d = Math.round(a * Math.pow(2, 52 - d) - Math.pow(2, 52))) : (c = 0, d = Math.round(a / Math.pow(2, -1074))));
        e = [];
        for (a = 52; a; a -= 1)e.push(d % 2 ? 1 : 0), d = Math.floor(d / 2);
        for (a = 11; a; a -= 1)e.push(c % 2 ? 1 : 0), c = Math.floor(c / 2);
        e.push(b ? 1 : 0);
        e.reverse();
        b = e.join("");
        c = "";
        for (a = 0; 64 > a; a += 8)d = parseInt(b.substr(a, 8), 2).toString(16), 1 === d.length &&
            (d = "0" + d), c += d;
        return c.toLowerCase()
    }

    function xb(a, b) {
        var c, d, e, f, g, k, l, m = b.slice(0), p = a;
        e = p[0];
        f = p[1];
        g = p[2];
        k = p[3];
        l = p[4];
        for (c = 0; 79 >= c; c++)16 <= c && (m[c] = (m[c - 3] ^ m[c - 8] ^ m[c - 14] ^ m[c - 16]) << 1 | (m[c - 3] ^ m[c - 8] ^ m[c - 14] ^ m[c - 16]) >>> 31), d = 19 >= c ? f & g | ~f & k : 39 >= c ? f ^ g ^ k : 59 >= c ? f & g | f & k | g & k : 79 >= c ? f ^ g ^ k : void 0, d = (e << 5 | e >>> 27) + d + l + m[c] + a.Pd[Math.floor(c / 20)] | 0, l = k, k = g, g = f << 30 | f >>> 2, f = e, e = d;
        p[0] = p[0] + e | 0;
        p[1] = p[1] + f | 0;
        p[2] = p[2] + g | 0;
        p[3] = p[3] + k | 0;
        p[4] = p[4] + l | 0
    }

    var str = ec(32);
    console.log(xb([1732584193, 4023233417, 2562383102, 271733878, 3285377520], [ [0, 0, 0, 0, 0]]), ec(32), ec(1));
})();