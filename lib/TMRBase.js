/**
 * Created by Mac003 on 14-9-18.
 */
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

function tmr_pack_message(msg, blockLength) {
    if (msg.length <= blockLength) return [msg];
    for (var c = [], d = 0; d < msg.length; d += blockLength) d + blockLength > msg ? c.push(msg.substring(d, msg.length)) : c.push(msg.substring(d, d + blockLength));
    return c
}

function tmr_uuid() {
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