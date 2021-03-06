(function () {
    var h, aa = this;

    function isDefined(a) {
        return void 0 !== a
    }

    function ba() {
    }

    function FBSingleton(a) {
        a.sharedInstance = function () {
            return a._sharedInstance ? a._sharedInstance : a._sharedInstance = new a
        }
    }

    function fb_typename(a) {
        var b = typeof a;
        if ("object" == b)if (a) {
            if (a instanceof Array)return"array";
            if (a instanceof Object)return b;
            var c = Object.prototype.toString.call(a);
            if ("[object Window]" == c)return"object";
            if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice"))return"array";
            if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call"))return"function"
        } else return"null";
        else if ("function" == b && "undefined" == typeof a.call)return"object";
        return b
    }

    function isArray(a) {
        return"array" == fb_typename(a)
    }

    function isArrayOrObject(a) {
        var b = fb_typename(a);
        return"array" == b || "object" == b && "number" == typeof a.length
    }

    function isString(a) {
        return"string" == typeof a
    }

    function isNumber(a) {
        return"number" == typeof a
    }

    function isObjectOrFunction(a) {
        var b = typeof a;
        return"object" == b && null != a || "function" == b
    }

    function fb_native_call(a, b, c) {
        return a.call.apply(a.bind, arguments)
    }

    function ja(a, b, c) {
        if (!a)throw Error();
        if (2 < arguments.length) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function () {
                var c = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(c, d);
                return a.apply(b, c)
            }
        }
        return function () {
            return a.apply(b, arguments)
        }
    }

    function r(a, b, c) {
        r = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? fb_native_call : ja;
        return r.apply(null, arguments)
    }

    function ka(a, b) {
        function c() {
        }

        c.prototype = b.prototype;
        a.me = b.prototype;
        a.prototype = new c;
        a.ke = function (a, c, f) {
            return b.prototype[c].apply(a, Array.prototype.slice.call(arguments, 2))
        }
    };
    function fb_json_to_object(a) {
        a = String(a);
        if (/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, "")))try {
            return eval("(" + a + ")")
        } catch (b) {
        }
        throw Error("Invalid JSON string: " + a);
    }

    function fb_json_block() {
        this.pc = void 0
    }

    function fb_object_to_json(a, b, c) {
        switch (typeof b) {
            case "string":
                oa(b, c);
                break;
            case "number":
                c.push(isFinite(b) && !isNaN(b) ? b : "null");
                break;
            case "boolean":
                c.push(b);
                break;
            case "undefined":
                c.push("null");
                break;
            case "object":
                if (null == b) {
                    c.push("null");
                    break
                }
                if (isArray(b)) {
                    var d = b.length;
                    c.push("[");
                    for (var e = "", f = 0; f < d; f++)c.push(e), e = b[f], fb_object_to_json(a, a.pc ? a.pc.call(b, String(f), e) : e, c), e = ",";
                    c.push("]");
                    break
                }
                c.push("{");
                d = "";
                for (f in b)Object.prototype.hasOwnProperty.call(b, f) && (e = b[f], "function" != typeof e && (c.push(d), oa(f, c),
                    c.push(":"), fb_object_to_json(a, a.pc ? a.pc.call(b, f, e) : e, c), d = ","));
                c.push("}");
                break;
            case "function":
                break;
            default:
                throw Error("Unknown type: " + typeof b);
        }
    }

    var pa = {'"': '\\"', "\\": "\\\\", "/": "\\/", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\x0B": "\\u000b"}, qa = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;

    function oa(a, b) {
        b.push('"', a.replace(qa, function (a) {
            if (a in pa)return pa[a];
            var b = a.charCodeAt(0), e = "\\u";
            16 > b ? e += "000" : 256 > b ? e += "00" : 4096 > b && (e += "0");
            return pa[a] = e + b.toString(16)
        }), '"')
    }

    function JSONParse(a) {
        return"undefined" !== typeof JSON && isDefined(JSON.parse) ? JSON.parse(a) : fb_json_to_object(a)
    }

    function u(a) {
        if ("undefined" !== typeof JSON && isDefined(JSON.stringify))a = JSON.stringify(a); else {
            var b = [];
            fb_object_to_json(new fb_json_block, a, b);
            a = b.join("")
        }
        return a
    }

    function stringToASCIIArray(a) {
        for (var b = [], c = 0, d = 0; d < a.length; d++) {
            var e = a.charCodeAt(d);
            55296 <= e && 56319 >= e && (e -= 55296, d++, fb_assert(d < a.length, "Surrogate pair missing trail surrogate."), e = 65536 + (e << 10) + (a.charCodeAt(d) - 56320));
            128 > e ? b[c++] = e : (2048 > e ? b[c++] = e >> 6 | 192 : (65536 > e ? b[c++] = e >> 12 | 224 : (b[c++] = e >> 18 | 240, b[c++] = e >> 12 & 63 | 128), b[c++] = e >> 6 & 63 | 128), b[c++] = e & 63 | 128)
        }
        return b
    }

    var ta = {};

    function fb_check_args(a, b, c, d) {
        var e;
        d < b ? e = "at least " + b : d > c && (e = 0 === c ? "none" : "no more than " + c);
        if (e)throw Error(a + " failed: Was called with " + d + (1 === d ? " argument." : " arguments.") + " Expects " + e + ".");
    }

    function errorPrefix_(a, b, c) {
        var d = "";
        switch (b) {
            case 1:
                d = c ? "first" : "First";
                break;
            case 2:
                d = c ? "second" : "Second";
                break;
            case 3:
                d = c ? "third" : "Third";
                break;
            case 4:
                d = c ? "fourth" : "Fourth";
                break;
            default:
                ua.assert(!1, "errorPrefix_ called with argumentNumber > 4.  Need to update it?")
        }
        return a = a + " failed: " + (d + " argument ")
    }

    function isValidFunction(a, b, c, d) {
        if ((!d || isDefined(c)) && "function" != fb_typename(c))throw Error(errorPrefix_(a, b, d) + "must be a valid function.");
    }

    function isValidContext(a, b, c) {
        if (isDefined(c) && (!isObjectOrFunction(c) || null === c))throw Error(errorPrefix_(a, b, !0) + "must be a valid context object.");
    };
    function A(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    }

    function fb_getProperty(a, b) {
        if (Object.prototype.hasOwnProperty.call(a, b))return a[b]
    };
    var ua = {}, xa = /[\[\].#$\/\u0000-\u001F\u007F]/, ya = /[\[\].#$\u0000-\u001F\u007F]/;

    function isValidString(a) {
        return isString(a) && 0 !== a.length && !xa.test(a)
    }

    function Aa(a, b, c) {
        c && !isDefined(b) || Ba(errorPrefix_(a, 1, c), b)
    }

    function Ba(a, b, c, d) {
        c || (c = 0);
        d = d || [];
        if (!isDefined(b))throw Error(a + "contains undefined" + Ca(d));
        if ("function" == fb_typename(b))throw Error(a + "contains a function" + Ca(d) + " with contents: " + b.toString());
        if (isInfinityNumber(b))throw Error(a + "contains " + b.toString() + Ca(d));
        if (1E3 < c)throw new TypeError(a + "contains a cyclic object value (" + d.slice(0, 100).join(".") + "...)");
        if (isString(b) && b.length > 10485760 / 3 && 10485760 < stringToASCIIArray(b).length)throw Error(a + "contains a string greater than 10485760 utf8 bytes" + Ca(d) + " ('" + b.substring(0, 50) + "...')");
        if (isObjectOrFunction(b))for (var e in b)if (A(b, e)) {
            var f = b[e];
            if (".priority" !== e && ".value" !== e && ".sv" !== e && !isValidString(e))throw Error(a + " contains an invalid key (" + e + ")" + Ca(d) + '.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');
            d.push(e);
            Ba(a, f, c + 1, d);
            d.pop()
        }
    }

    function Ca(a) {
        return 0 == a.length ? "" : " in property '" + a.join(".") + "'"
    }

    function fb_check_object(a, b) {
        if (!isObjectOrFunction(b) || isArray(b))throw Error(errorPrefix_(a, 1, !1) + " must be an Object containing the children to replace.");
        Aa(a, b, !1)
    }

    function fb_check_priority(a, b, c, d) {
        if (!(d && !isDefined(c) || null === c || isNumber(c) || isString(c) || isObjectOrFunction(c) && A(c, ".sv")))throw Error(errorPrefix_(a, b, d) + "must be a valid firebase priority (a string, number, or null).");
    }

    function fb_check_msg_type(a, b, c) {
        if (!c || isDefined(b))switch (b) {
            case "value":
            case "child_added":
            case "child_removed":
            case "child_changed":
            case "child_moved":
                break;
            default:
                throw Error(errorPrefix_(a, 1, c) + 'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');
        }
    }

    function fb_check_key(a, b) {
        if (isDefined(b) && !isValidString(b))throw Error(errorPrefix_(a, 2, !0) + 'was an invalid key: "' + b + '".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');
    }

    function fb_check_path(a, b) {
        if (!isString(b) || 0 === b.length || ya.test(b))throw Error(errorPrefix_(a, 1, !1) + 'was an invalid path: "' + b + '". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');
    }

    function fb_check_modify_info(a, b) {
        if (".info" === fb_safe_get_subpath(b))throw Error(a + " failed: Can't modify data under /.info/");
    }
    function FirebaseObject(a, b, c, d, e, f, g) {
        this.m = a;
        this.path = b;
        this.Ca = c;
        this.da = d;
        this.wa = e;
        this.Aa = f;
        this.Ya = g;
        if (isDefined(this.da) && isDefined(this.Aa) && isDefined(this.Ca))throw"Query: Can't combine startAt(), endAt(), and limit().";
    }

    FirebaseObject.prototype.ref = function () {
        fb_check_args("Query.ref", 0, 0, arguments.length);
        return new Firebase(this.m, this.path)
    };

    FirebaseObject.prototype.on = function (a, b) {
        fb_check_args("Query.on", 2, 4, arguments.length);
        fb_check_msg_type("Query.on", a, !1);
        isValidFunction("Query.on", 2, b, !1);
        var c = Ja("Query.on", arguments[2], arguments[3]);
        this.m.Sb(this, a, b, c.cancel, c.Y);
        return b
    };

    FirebaseObject.prototype.off = function (a, b, c) {
        fb_check_args("Query.off", 0, 3, arguments.length);
        fb_check_msg_type("Query.off", a, !0);
        isValidFunction("Query.off", 2, b, !0);
        isValidContext("Query.off", 3, c);
        this.m.oc(this, a, b, c)
    };

    FirebaseObject.prototype.once = function (a, b) {
        function c(g) {
            f && (f = !1, e.off(a, c), b.call(d.Y, g))
        }

        fb_check_args("Query.once", 2, 4, arguments.length);
        fb_check_msg_type("Query.once", a, !1);
        isValidFunction("Query.once", 2, b, !1);
        var d = Ja("Query.once", arguments[2], arguments[3]), e = this, f = !0;
        this.on(a, c, function (b) {
            e.off(a, c);
            d.cancel && d.cancel.call(d.Y, b)
        })
    };

    FirebaseObject.prototype.limit = function (a) {
        fb_check_args("Query.limit", 1, 1, arguments.length);
        if (!isNumber(a) || Math.floor(a) !== a || 0 >= a)throw"Query.limit: First argument must be a positive integer.";
        return new FirebaseObject(this.m, this.path, a, this.da, this.wa, this.Aa, this.Ya)
    };

    FirebaseObject.prototype.startAt = function (a, b) {
        fb_check_args("Query.startAt", 0, 2, arguments.length);
        fb_check_priority("Query.startAt", 1, a, !0);
        fb_check_key("Query.startAt", b);
        isDefined(a) || (b = a = null);
        return new FirebaseObject(this.m, this.path, this.Ca, a, b, this.Aa, this.Ya)
    };

    FirebaseObject.prototype.endAt = function (a, b) {
        fb_check_args("Query.endAt", 0, 2, arguments.length);
        fb_check_priority("Query.endAt", 1, a, !0);
        fb_check_key("Query.endAt", b);
        return new FirebaseObject(this.m, this.path, this.Ca, this.da, this.wa, a, b)
    };

    FirebaseObject.prototype.euqalTo = function (a, b) {
        fb_check_args("Query.equalTo", 1, 2, arguments.length);
        fb_check_priority("Query.equalTo", 1, a, !1);
        fb_check_key("Query.equalTo", b);
        return this.startAt(a, b).endAt(a, b)
    };

    function Ka(a) {
        var b = {};
        isDefined(a.da) && (b.sp = a.da);
        isDefined(a.wa) && (b.sn = a.wa);
        isDefined(a.Aa) && (b.ep = a.Aa);
        isDefined(a.Ya) && (b.en = a.Ya);
        isDefined(a.Ca) && (b.l = a.Ca);
        isDefined(a.da) && isDefined(a.wa) && null === a.da && null === a.wa && (b.vf = "l");
        return b
    }

    FirebaseObject.prototype.queryIdentifier = function () {
        var a = La(Ka(this));
        return"{}" === a ? "default" : a
    };
    function Ja(a, b, c) {
        var d = {};
        if (b && c)d.cancel = b, isValidFunction(a, 3, d.cancel, !0), d.Y = c, isValidContext(a, 4, d.Y); else if (b)if ("object" === typeof b && null !== b)d.Y = b; else if ("function" === typeof b)d.cancel = b; else throw Error(ta.le(a, 3, !0) + "must either be a cancel callback or a context object.");
        return d
    }
    function FBPath(a, b) {
        if (1 == arguments.length) {
            this._subpaths = a.split("/");
            for (var c = 0, d = 0; d < this._subpaths.length; d++)0 < this._subpaths[d].length && (this._subpaths[c] = this._subpaths[d], c++);
            this._subpaths.length = c;
            this._level = 0
        } else this._subpaths = a, this._level = b
    }

    function fb_safe_get_subpath(a) {
        return a._level >= a._subpaths.length ? null : a._subpaths[a._level]
    }

    function fb_next_level_path(a) {
        var b = a._level;
        b < a._subpaths.length && b++;
        return new FBPath(a._subpaths, b)
    }

    function Na(a) {
        return a._level < a._subpaths.length ? a._subpaths[a._subpaths.length - 1] : null
    }

    FBPath.prototype.toString = function () {
        for (var a = "", b = this._level; b < this._subpaths.length; b++)"" !== this._subpaths[b] && (a += "/" + this._subpaths[b]);
        return a || "/"
    };
    FBPath.prototype.parent = function () {
        if (this._level >= this._subpaths.length)return null;
        for (var a = [], b = this._level; b < this._subpaths.length - 1; b++)a.push(this._subpaths[b]);
        return new FBPath(a, 0)
    };
    FBPath.prototype.child = function (a) {
        for (var b = [], c = this._level; c < this._subpaths.length; c++)b.push(this._subpaths[c]);
        if (a instanceof FBPath)for (c = a._level; c < a._subpaths.length; c++)b.push(a._subpaths[c]); else for (a = a.split("/"), c = 0; c < a.length; c++)0 < a[c].length && b.push(a[c]);
        return new FBPath(b, 0)
    };
    FBPath.prototype.f = function () {
        return this._level >= this._subpaths.length
    };
    FBPath.prototype.length = function () {
        return this._subpaths.length - this._level
    };
    function Oa(a, b) {
        var c = fb_safe_get_subpath(a);
        if (null === c)return b;
        if (c === fb_safe_get_subpath(b))return Oa(fb_next_level_path(a), fb_next_level_path(b));
        throw"INTERNAL ERROR: innerPath (" + b + ") is not within outerPath (" + a + ")";
    }

    FBPath.prototype.contains = function (a) {
        var b = this._level, c = a._level;
        if (this.length() > a.length())return!1;
        for (; b < this._subpaths.length;) {
            if (this._subpaths[b] !== a._subpaths[c])return!1;
            ++b;
            ++c
        }
        return!0
    };
    function Pa() {
        this.children = {};
        this.Ac = 0;
        this.value = null
    }

    function FBTree(a, b, c) {
        this._name = a ? a : "";
        this._parent = b ? b : null;
        this._root = c ? c : new Pa
    }

    function I(a, b) {
        for (var c = b instanceof FBPath ? b : new FBPath(b), d = a, e; null !== (e = fb_safe_get_subpath(c));)d = new FBTree(e, d, fb_getProperty(d._root.children, e) || new Pa), c = fb_next_level_path(c);
        return d
    }

    FBTree.prototype.j = function () {
        return this._root.value
    };
    function J(a, b) {
        fb_assert("undefined" !== typeof b, "Cannot set value to undefined");
        a._root.value = b;
        Ra(a)
    }

    FBTree.prototype.hasChildren = function () {
        return 0 < this._root.Ac
    };
    FBTree.prototype.f = function () {
        return null === this.j() && !this.hasChildren()
    };
    FBTree.prototype.A = function (a) {
        for (var b in this._root.children)a(new FBTree(b, this, this._root.children[b]))
    };
    function Sa(a, b, c, d) {
        c && !d && b(a);
        a.A(function (a) {
            Sa(a, b, !0, d)
        });
        c && d && b(a)
    }

    function Ta(a, b, c) {
        for (a = c ? a : a.parent(); null !== a;) {
            if (b(a))return!0;
            a = a.parent()
        }
        return!1
    }

    FBTree.prototype.path = function () {
        return new FBPath(null === this._parent ? this._name : this._parent.path() + "/" + this._name)
    };
    FBTree.prototype.name = function () {
        return this._name
    };
    FBTree.prototype.parent = function () {
        return this._parent
    };
    function Ra(a) {
        if (null !== a._parent) {
            var b = a._parent, c = a._name, d = a.f(), e = A(b._root.children, c);
            d && e ? (delete b._root.children[c], b._root.Ac--, Ra(b)) : d || e || (b._root.children[c] = a._root, b._root.Ac++, Ra(b))
        }
    };
    function FBComp(compator, b) {
        this._comp = compator ? compator : fb_compator;
        this.ca = b ? b : kFBDefaultCallback
    }

    function fb_compator(a, b) {
        return a < b ? -1 : a > b ? 1 : 0
    }

    FBComp.prototype.qa = function (a, b) {
        return new FBComp(this._comp, this.ca.qa(a, b, this._comp).J(null, null, !1, null, null))
    }
    FBComp.prototype.remove = function (a) {
        return new FBComp(this._comp, this.ca.remove(a, this._comp).J(null, null, !1, null, null))
    }
    FBComp.prototype.get = function (a) {
        for (var b, c = this.ca; !c.f();) {
            b = this._comp(a, c.key);
            if (0 === b)return c.value;
            0 > b ? c = c.left : 0 < b && (c = c.right)
        }
        return null
    }

    function Xa(a, b) {
        for (var c, d = a.ca, e = null; !d.f();) {
            c = a._comp(b, d.key);
            if (0 === c) {
                if (d.left.f())return e ? e.key : null;
                for (d = d.left; !d.right.f();)d = d.right;
                return d.key
            }
            0 > c ? d = d.left : 0 < c && (e = d, d = d.right)
        }
        throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");
    }

    FBComp.prototype.f = function () {
        return this.ca.f()
    };
    FBComp.prototype.count = function () {
        return this.ca.count()
    };
    FBComp.prototype.yb = function () {
        return this.ca.yb()
    };
    FBComp.prototype.bb = function () {
        return this.ca.bb()
    };
    FBComp.prototype.Ba = function (a) {
        return this.ca.Ba(a)
    };
    FBComp.prototype.Ra = function (a) {
        return this.ca.Ra(a)
    };
    FBComp.prototype.ab = function (a) {
        return new Ya(this.ca, a)
    };
    function Ya(a, b) {
        this.vd = b;
        for (this.cc = []; !a.f();)this.cc.push(a), a = a.left
    }

    function Za(a) {
        if (0 === a.cc.length)return null;
        var b = a.cc.pop(), c;
        c = a.vd ? a.vd(b.key, b.value) : {key: b.key, value: b.value};
        for (b = b.right; !b.f();)a.cc.push(b), b = b.left;
        return c
    }

    function RBTree(a, b, c, d, e) {
        this.key = a;
        this.value = b;
        this.color = null != c ? c : !0;
        this.left = null != d ? d : kFBDefaultCallback;
        this.right = null != e ? e : kFBDefaultCallback
    }

    RBTree.prototype.J = function (a, b, c, d, e) {
        return new RBTree(null != a ? a : this.key, null != b ? b : this.value, null != c ? c : this.getColor, null != d ? d : this.left, null != e ? e : this.right)
    };
    RBTree.prototype.count = function () {
        return this.left.count() + 1 + this.right.count()
    };
    RBTree.prototype.f = function () {
        return!1
    };
    RBTree.prototype.Ba = function (a) {
        return this.left.Ba(a) || a(this.key, this.value) || this.right.Ba(a)
    };
    RBTree.prototype.Ra = function (a) {
        return this.right.Ra(a) || a(this.key, this.value) || this.left.Ra(a)
    };
    function cb(a) {
        return a.left.f() ? a : cb(a.left)
    }

    RBTree.prototype.yb = function () {
        return cb(this).key
    };
    RBTree.prototype.bb = function () {
        return this.right.f() ? this.key : this.right.bb()
    };
    RBTree.prototype.qa = function (a, b, c) {
        var d, e;
        e = this;
        d = c(a, e.key);
        e = 0 > d ? e.J(null, null, null, e.left.qa(a, b, c), null) : 0 === d ? e.J(null, b, null, null, null) : e.J(null, null, null, null, e.right.qa(a, b, c));
        return db(e)
    };
    function eb(a) {
        if (a.left.f())return kFBDefaultCallback;
        a.left.getColor() || a.left.left.getColor() || (a = fb(a));
        a = a.J(null, null, null, eb(a.left), null);
        return db(a)
    }

    RBTree.prototype.remove = function (a, b) {
        var c, d;
        c = this;
        if (0 > b(a, c.key))c.left.f() || c.left.getColor() || c.left.left.getColor() || (c = fb(c)), c = c.J(null, null, null, c.left.remove(a, b), null); else {
            c.left.getColor() && (c = gb(c));
            c.right.f() || c.right.getColor() || c.right.left.getColor() || (c = hb(c), c.left.left.getColor() && (c = gb(c), c = hb(c)));
            if (0 === b(a, c.key)) {
                if (c.right.f())return kFBDefaultCallback;
                d = cb(c.right);
                c = c.J(d.key, d.value, null, null, eb(c.right))
            }
            c = c.J(null, null, null, null, c.right.remove(a, b))
        }
        return db(c)
    };
    RBTree.prototype.getColor = function () {
        return this.color
    };
    function db(a) {
        a.right.getColor() && !a.left.getColor() && (a = ib(a));
        a.left.getColor() && a.left.left.getColor() && (a = gb(a));
        a.left.getColor() && a.right.getColor() && (a = hb(a));
        return a
    }

    function fb(a) {
        a = hb(a);
        a.right.left.getColor() && (a = a.J(null, null, null, null, gb(a.right)), a = ib(a), a = hb(a));
        return a
    }

    function ib(a) {
        return a.right.J(null, null, a.getColor, a.J(null, null, !0, null, a.right.left), null)
    }

    function gb(a) {
        return a.left.J(null, null, a.getColor, null, a.J(null, null, !0, a.left.right, null))
    }

    function hb(a) {
        return a.J(null, null, !a.getColor, a.left.J(null, null, !a.left.getColor, null, null), a.right.J(null, null, !a.right.getColor, null, null))
    }

    function FBCallback() {
    }

    FBCallback.prototype.J = function () {
        return this
    }
    FBCallback.prototype.qa = function (a, b) {
        return new RBTree(a, b, null)
    };
    FBCallback.prototype.remove = function () {
        return this
    };
    FBCallback.prototype.count = function () {
        return 0
    };
    FBCallback.prototype.f = function () {
        return!0
    };
    FBCallback.prototype.Ba = function () {
        return!1
    };
    FBCallback.prototype.Ra = function () {
        return!1
    };
    FBCallback.prototype.yb = function () {
        return null
    };
    FBCallback.prototype.bb = function () {
        return null
    };
    FBCallback.prototype.getColor = function () {
        return!1
    };
    var kFBDefaultCallback = new FBCallback;

    function FBStorageService(a) {
        this._imp = a;
        this._prefix = "firebase:"
    }

    FBStorageService.prototype.set = function (a, b) {
        null == b ? this._imp.removeItem(this._prefix + a) : this._imp.setItem(this._prefix + a, u(b))
    };
    FBStorageService.prototype.get = function (a) {
        a = this._imp.getItem(this._prefix + a);
        return null == a ? null : JSONParse(a)
    };
    FBStorageService.prototype.remove = function (a) {
        this._imp.removeItem(this._prefix + a)
    };
    FBStorageService.prototype.od = !1;
    function FBMemoryStorage() {
        this._imp = {}
    }

    FBMemoryStorage.prototype.set = function (a, b) {
        null == b ? delete this._imp[a] : this._imp[a] = b
    };
    FBMemoryStorage.prototype.get = function (a) {
        return A(this._imp, a) ? this._imp[a] : null
    };
    FBMemoryStorage.prototype.remove = function (a) {
        delete this._imp[a]
    };
    FBMemoryStorage.prototype.od = true;
    function FBGetServiceByName(a) {
        try {
            if ("undefined" !== typeof window && "undefined" !== typeof window[a]) {
                var b = window[a];
                b.setItem("firebase:sentinel", "cache");
                b.removeItem("firebase:sentinel");
                return new FBStorageService(b)
            }
        } catch (c) {
        }
        return new FBMemoryStorage
    }

    var FBLocalStorage = FBGetServiceByName("localStorage"), FBSessionStorage = FBGetServiceByName("sessionStorage");

    function ConnectionTarget(a, b, c, d) {
        this.host = a.toLowerCase();
        this.domain = this.host.substr(this.host.indexOf(".") + 1);
        this.qc = b;
        this.bc = c;
        this.ie = d;
        this.ga = FBLocalStorage.get("host:" + a) || this.host
    }

    function qb(a, b) {
        b !== a.ga && (a.ga = b, "s-" === a.ga.substr(0, 2) && FBLocalStorage.set("host:" + a.host, a.ga))
    }

    ConnectionTarget.prototype.toString = function () {
        return(this.qc ? "https://" : "http://") + this.host
    };

    "use strict";
    function rb(a, b) {
        if (0 === a.length || 0 === b.length)return a.concat(b);
        var c = a[a.length - 1], d = Math.round(c / 1099511627776) || 32, e;
        if (32 === d)e = a.concat(b); else {
            e = b;
            var c = c | 0, f = a.slice(0, a.length - 1), g;
            for (void 0 === f && (f = []); 32 <= d; d -= 32)f.push(c), c = 0;
            if (0 === d)e = f.concat(e); else {
                for (g = 0; g < e.length; g++)f.push(c | e[g] >>> d), c = e[g] << 32 - d;
                g = e.length ? e[e.length - 1] : 0;
                e = Math.round(g / 1099511627776) || 32;
                f.push(sb(d + e & 31, 32 < d + e ? c : f.pop(), 1));
                e = f
            }
        }
        return e
    }

    function tb(a) {
        var b = a.length;
        return 0 === b ? 0 : 32 * (b - 1) + (Math.round(a[b - 1] / 1099511627776) || 32)
    }

    function sb(a, b, c) {
        return 32 === a ? b : (c ? b | 0 : b << 32 - a) + 1099511627776 * a
    }

    function ub(a) {
        var b, c = "", d = 0, e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", f = 0, g = tb(a);
        b && (e = e.substr(0, 62) + "-_");
        for (b = 0; 6 * c.length < g;)c += e.charAt((f ^ a[b] >>> d) >>> 26), 6 > d ? (f = a[b] << 6 - d, d += 26, b++) : (f <<= 6, d -= 6);
        for (; c.length & 3;)c += "=";
        return c
    }

    function vb(a) {
        a ? (this.Tb = a.Tb.slice(0), this.nb = a.nb.slice(0), this.Ua = a.Ua) : this.reset()
    }

    function wb(a) {
        a = (new vb).update(a);
        var b, c = a.nb, d = a.Tb, c = rb(c, [sb(1, 1)]);
        for (b = c.length + 2; b & 15; b++)c.push(0);
        c.push(Math.floor(a.Ua / 4294967296));
        for (c.push(a.Ua | 0); c.length;)xb(a, c.splice(0, 16));
        a.reset();
        return d
    }

    vb.prototype = {zc: 512, reset: function () {
        this.Tb = this.Md.slice(0);
        this.nb = [];
        this.Ua = 0;
        return this
    }, update: function (a) {
        if ("string" === typeof a) {
            a = unescape(encodeURIComponent(a));
            var b = [], c, d = 0;
            for (c = 0; c < a.length; c++)d = d << 8 | a.charCodeAt(c), 3 === (c & 3) && (b.push(d), d = 0);
            c & 3 && b.push(sb(8 * (c & 3), d));
            a = b
        }
        c = this.nb = rb(this.nb, a);
        b = this.Ua;
        a = this.Ua = b + tb(a);
        for (b = this.zc + b & -this.zc; b <= a; b += this.zc)xb(this, c.splice(0, 16));
        return this
    }, Md: [1732584193, 4023233417, 2562383102, 271733878, 3285377520], Pd: [1518500249, 1859775393,
        2400959708, 3395469782]};
    function xb(a, b) {
        var c, d, e, f, g, k, l, m = b.slice(0), p = a.Tb;
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
    };
    var yb = Array.prototype, zb = yb.forEach ? function (a, b, c) {
            yb.forEach.call(a, b, c)
        } : function (a, b, c) {
            for (var d = a.length, e = isString(a) ? a.split("") : a, f = 0; f < d; f++)f in e && b.call(c, e[f], f, a)
        }, Ab = yb.map ? function (a, b, c) {
            return yb.map.call(a, b, c)
        } : function (a, b, c) {
            for (var d = a.length, e = Array(d), f = isString(a) ? a.split("") : a, g = 0; g < d; g++)g in f && (e[g] = b.call(c, f[g], g, a));
            return e
        }, Bb = yb.reduce ? function (a, b, c, d) {
            d && (b = r(b, d));
            return yb.reduce.call(a, b, c)
        } : function (a, b, c, d) {
            var e = c;
            zb(a, function (c, g) {
                e = b.call(d, e, c, g, a)
            });
            return e
        },
        Cb = yb.every ? function (a, b, c) {
            return yb.every.call(a, b, c)
        } : function (a, b, c) {
            for (var d = a.length, e = isString(a) ? a.split("") : a, f = 0; f < d; f++)if (f in e && !b.call(c, e[f], f, a))return!1;
            return!0
        };

    function Db(a, b) {
        var c;
        a:{
            c = a.length;
            for (var d = isString(a) ? a.split("") : a, e = 0; e < c; e++)if (e in d && b.call(void 0, d[e], e, a)) {
                c = e;
                break a
            }
            c = -1
        }
        return 0 > c ? null : isString(a) ? a.charAt(c) : a[c]
    };
    var Eb;
    a:{
        var Fb = aa.navigator;
        if (Fb) {
            var Gb = Fb.userAgent;
            if (Gb) {
                Eb = Gb;
                break a
            }
        }
        Eb = ""
    }
    function Hb(a) {
        return-1 != Eb.indexOf(a)
    };
    var Ib = Hb("Opera") || Hb("OPR"), Jb = Hb("Trident") || Hb("MSIE"), Kb = Hb("Gecko") && -1 == Eb.toLowerCase().indexOf("webkit") && !(Hb("Trident") || Hb("MSIE")), Lb = -1 != Eb.toLowerCase().indexOf("webkit");
    (function () {
        var a = "", b;
        if (Ib && aa.opera)return a = aa.opera.version, "function" == fb_typename(a) ? a() : a;
        Kb ? b = /rv\:([^\);]+)(\)|;)/ : Jb ? b = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : Lb && (b = /WebKit\/(\S+)/);
        b && (a = (a = b.exec(Eb)) ? a[1] : "");
        return Jb && (b = (b = aa.document) ? b.documentMode : void 0, b > parseFloat(a)) ? String(b) : a
    })();
    var Mb = null, Nb = null;
    var Ob = function () {
        var a = 1;
        return function () {
            return a++
        }
    }();

    function fb_assert(a, b) {
        if (!a)throw Error("Firebase INTERNAL ASSERT FAILED:" + b);
    }

    function Pb(a) {
        for (var b = "", c = 0; c < arguments.length; c++)b = isArrayOrObject(arguments[c]) ? b + Pb.apply(null, arguments[c]) : "object" === typeof arguments[c] ? b + u(arguments[c]) : b + arguments[c], b += " ";
        return b
    }

    var Qb = null, Rb = !0;

    function K(a) {
        console.log(Pb.apply(null, arguments));
        !0 === Rb && (Rb = !1, null === Qb && !0 === FBSessionStorage.get("logging_enabled") && fb_is_log_enabled(!0));
        if (Qb) {
            var b = Pb.apply(null, arguments);
            Qb(b)
        }
    }

    function Tb(a) {
        return function () {
            K(a, arguments)
        }
    }

    function fb_log_error(a) {
        if ("undefined" !== typeof console) {
            var b = "FIREBASE INTERNAL ERROR: " + Pb.apply(null, arguments);
            "undefined" !== typeof console.error ? console.error(b) : console.log(b)
        }
    }

    function fb_throw(a) {
        var b = Pb.apply(null, arguments);
        throw Error("FIREBASE FATAL ERROR: " + b);
    }

    function fb_warning(a) {
        if ("undefined" !== typeof console) {
            var b = "FIREBASE WARNING: " + Pb.apply(null, arguments);
            "undefined" !== typeof console.warn ? console.warn(b) : console.log(b)
        }
    }

    function isInfinityNumber(a) {
        return isNumber(a) && (a != a || a == Number.POSITIVE_INFINITY || a == Number.NEGATIVE_INFINITY)
    }

    function fb_call_on_loaded(a) {
        if ("complete" === document.readyState)a(); else {
            var b = !1, c = function () {
                document.body ? b || (b = !0, a()) : setTimeout(c, 10)
            };
            document.addEventListener ? (document.addEventListener("DOMContentLoaded", c, !1), window.addEventListener("load", c, !1)) : document.attachEvent && (document.attachEvent("onreadystatechange", function () {
                "complete" === document.readyState && c()
            }), window.attachEvent("onload", c))
        }
    }

    function Xb(a, b) {
        return a !== b ? null === a ? -1 : null === b ? 1 : typeof a !== typeof b ? "number" === typeof a ? -1 : 1 : a > b ? 1 : -1 : 0
    }

    function Yb(a, b) {
        if (a === b)return 0;
        var c = fb_normalize_number(a), d = fb_normalize_number(b);
        return null !== c ? null !== d ? 0 == c - d ? a.length - b.length : c - d : -1 : null !== d ? 1 : a < b ? -1 : 1
    }

    function $b(a, b) {
        if (b && a in b)return b[a];
        throw Error("Missing required key (" + a + ") in object: " + u(b));
    }

    function La(a) {
        if ("object" !== typeof a || null === a)return u(a);
        var b = [], c;
        for (c in a)b.push(c);
        b.sort();
        c = "{";
        for (var d = 0; d < b.length; d++)0 !== d && (c += ","), c += u(b[d]), c += ":", c += La(a[b[d]]);
        return c + "}"
    }

    function ac(a, b) {
        if (a.length <= b)return[a];
        for (var c = [], d = 0; d < a.length; d += b)d + b > a ? c.push(a.substring(d, a.length)) : c.push(a.substring(d, d + b));
        return c
    }

    function bc(a, b) {
        if (isArray(a))for (var c = 0; c < a.length; ++c)b(c, a[c]); else cc(a, b)
    }

    function dc(a, b) {
        return b ? r(a, b) : a
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

    function fc(a) {
        var b = "Unknown Error";
        "too_big" === a ? b = "The data requested exceeds the maximum size that can be accessed with a single request." : "permission_denied" == a ? b = "Client doesn't have permission to access the desired data." : "unavailable" == a && (b = "The service is unavailable");
        b = Error(a + ": " + b);
        b.code = a.toUpperCase();
        return b
    }

    var gc = /^-?\d{1,10}$/;

    function fb_normalize_number(a) {
        return gc.test(a) && (a = Number(a), -2147483648 <= a && 2147483647 >= a) ? a : null
    }

    function fb_safe_exec(a) {
        try {
            a()
        } catch (b) {
            setTimeout(function () {
                throw b;
            }, 0)
        }
    };
    function FBLeafNode(a, b) {
        this.F = a;
        fb_assert(null !== this.F, "LeafNode shouldn't be created with null value.");
        this._priority = "undefined" !== typeof b ? b : null
    }

    FBLeafNode.prototype.O = function () {
        return true
    };
    FBLeafNode.prototype.getPriority = function () {
        return this._priority
    };
    FBLeafNode.prototype.copy = function (a) {
        return new FBLeafNode(this.F, a)
    };
    FBLeafNode.prototype.N = function () {
        return kFBGlobalNode
    };
    FBLeafNode.prototype.K = function (a) {
        return null === fb_safe_get_subpath(a) ? this : kFBGlobalNode
    };
    FBLeafNode.prototype.fa = function () {
        return null
    };
    FBLeafNode.prototype.H = function (a, b) {
        return(new FBNode).H(a, b).copy(this._priority)
    };
    FBLeafNode.prototype.ya = function (a, b) {
        var c = fb_safe_get_subpath(a);
        return null === c ? b : this.H(c, kFBGlobalNode.ya(fb_next_level_path(a), b))
    };
    FBLeafNode.prototype.f = function () {
        return!1
    };
    FBLeafNode.prototype.numChildren = function () {
        return 0
    };
    FBLeafNode.prototype.val = function (a) {
        return a && null !== this.getPriority() ? {".value": this.j(), ".priority": this.getPriority()} : this.j()
    };
    FBLeafNode.prototype.hash = function () {
        var a = "";
        null !== this.getPriority() && (a += "priority:" + fb_number_to_string(this.getPriority()) + ":");
        var b = typeof this.F, a = a + (b + ":"), a = "number" === b ? a + ec(this.F) : a + this.F;
        return ub(wb(a))
    };
    FBLeafNode.prototype.j = function () {
        return this.F
    };
    FBLeafNode.prototype.toString = function () {
        return"string" === typeof this.F ? this.F : '"' + this.F + '"'
    };
    function lc(a, b) {
        return Xb(a.ja, b.ja) || Yb(a.name, b.name)
    }

    function mc(a, b) {
        return Yb(a.name, b.name)
    }

    function nc(a, b) {
        return Yb(a, b)
    };
    function FBNode(a, b) {
        this.n = a || new FBComp(nc);
        this._priority = "undefined" !== typeof b ? b : null
    }


    FBNode.prototype.O = function () {
        return false;
    };
    FBNode.prototype.getPriority = function () {
        return this._priority
    };
    FBNode.prototype.copy = function (a) {
        return new FBNode(this.n, a)
    };
    FBNode.prototype.H = function (a, b) {
        var c = this.n.remove(a);
        b && b.f() && (b = null);
        null !== b && (c = c.qa(a, b));
        return b && null !== b.getPriority() ? new oc(c, null, this._priority) : new FBNode(c, this._priority)
    };
    FBNode.prototype.ya = function (a, b) {
        var c = fb_safe_get_subpath(a);
        if (null === c)return b;
        var d = this.N(c).ya(fb_next_level_path(a), b);
        return this.H(c, d)
    };
    FBNode.prototype.f = function () {
        return this.n.f()
    };
    FBNode.prototype.numChildren = function () {
        return this.n.count()
    };
    var pc = /^\d+$/;

    FBNode.prototype.val = function (a) {
        if (this.f())return null;
        var b = {}, c = 0, d = 0, e = !0;
        this.A(function (f, g) {
            b[f] = g.val(a);
            c++;
            e && pc.test(f) ? d = Math.max(d, Number(f)) : e = !1
        });
        if (!a && e && d < 2 * c) {
            var f = [], g;
            for (g in b)f[g] = b[g];
            return f
        }
        a && null !== this.getPriority() && (b[".priority"] = this.getPriority());
        return b
    };
    FBNode.prototype.hash = function () {
        var a = "";
        null !== this.getPriority() && (a += "priority:" + fb_number_to_string(this.getPriority()) + ":");
        this.A(function (b, c) {
            var d = c.hash();
            "" !== d && (a += ":" + b + ":" + d)
        });
        return"" === a ? "" : ub(wb(a))
    };
    FBNode.prototype.N = function (a) {
        a = this.n.get(a);
        return null === a ? kFBGlobalNode : a
    };
    FBNode.prototype.K = function (a) {
        var b = fb_safe_get_subpath(a);
        return null === b ? this : this.N(b).K(fb_next_level_path(a))
    };
    FBNode.prototype.fa = function (a) {
        return Xa(this.n, a)
    };
    FBNode.prototype.jd = function () {
        return this.n.yb()
    };
    FBNode.prototype.ld = function () {
        return this.n.bb()
    };
    FBNode.prototype.A = function (a) {
        return this.n.Ba(a)
    };
    FBNode.prototype.Fc = function (a) {
        return this.n.Ra(a)
    };
    FBNode.prototype.ab = function () {
        return this.n.ab()
    };
    FBNode.prototype.toString = function () {
        var a = "{", b = !0;
        this.A(function (c, d) {
            b ? b = !1 : a += ", ";
            a += '"' + c + '" : ' + d.toString()
        });
        return a += "}"
    };
    var kFBGlobalNode = new FBNode;

    function oc(a, b, c) {
        FBNode.call(this, a, c);
        null === b && (b = new FBComp(lc), a.Ba(function (a, c) {
            b = b.qa({name: a, ja: c.getPriority()}, c)
        }));
        this.va = b
    }

    ka(oc, FBNode);
    h = oc.prototype;
    h.H = function (a, b) {
        var c = this.N(a), d = this.n, e = this.va;
        null !== c && (d = d.remove(a), e = e.remove({name: a, ja: c.getPriority()}));
        b && b.f() && (b = null);
        null !== b && (d = d.qa(a, b), e = e.qa({name: a, ja: b.getPriority()}, b));
        return new oc(d, e, this.getPriority())
    };
    h.fa = function (a, b) {
        var c = Xa(this.va, {name: a, ja: b.getPriority()});
        return c ? c.name : null
    };
    h.A = function (a) {
        return this.va.Ba(function (b, c) {
            return a(b.name, c)
        })
    };
    h.Fc = function (a) {
        return this.va.Ra(function (b, c) {
            return a(b.name, c)
        })
    };
    h.ab = function () {
        return this.va.ab(function (a, b) {
            return{key: a.name, value: b}
        })
    };
    h.jd = function () {
        return this.va.f() ? null : this.va.yb().name
    };
    h.ld = function () {
        return this.va.f() ? null : this.va.bb().name
    };
    function O(a, b) {
        if (null === a)return kFBGlobalNode;
        var c = null;
        "object" === typeof a && ".priority"in a ? c = a[".priority"] : "undefined" !== typeof b && (c = b);
        fb_assert(null === c || "string" === typeof c || "number" === typeof c || "object" === typeof c && ".sv"in c, "Invalid priority type found: " + typeof c);
        "object" === typeof a && ".value"in a && null !== a[".value"] && (a = a[".value"]);
        if ("object" !== typeof a || ".sv"in a)return new FBLeafNode(a, c);
        if (a instanceof Array) {
            var d = kFBGlobalNode, e = a;
            cc(e, function (a, b) {
                if (A(e, b) && "." !== b.substring(0, 1)) {
                    var c = O(a);
                    if (c.O() || !c.f())d =
                        d.H(b, c)
                }
            });
            return d.copy(c)
        }
        var f = [], g = {}, k = !1, l = a;
        bc(l, function (a, b) {
            if ("string" !== typeof b || "." !== b.substring(0, 1)) {
                var c = O(l[b]);
                c.f() || (k = k || null !== c.getPriority(), f.push({name: b, ja: c.getPriority()}), g[b] = c)
            }
        });
        var m = qc(f, g, !1);
        if (k) {
            var p = qc(f, g, !0);
            return new oc(m, p, c)
        }
        return new FBNode(m, c)
    }

    var rc = Math.log(2);

    function sc(a) {
        this.count = parseInt(Math.log(a + 1) / rc, 10);
        this.ed = this.count - 1;
        this.Hd = a + 1 & parseInt(Array(this.count + 1).join("1"), 2)
    }

    function tc(a) {
        var b = !(a.Hd & 1 << a.ed);
        a.ed--;
        return b
    }

    function qc(a, b, c) {
        function d(e, f) {
            var l = f - e;
            if (0 == l)return null;
            if (1 == l) {
                var l = a[e].name, m = c ? a[e] : l;
                return new RBTree(m, b[l], !1, null, null)
            }
            var m = parseInt(l / 2, 10) + e, p = d(e, m), t = d(m + 1, f), l = a[m].name, m = c ? a[m] : l;
            return new RBTree(m, b[l], !1, p, t)
        }

        var e = c ? lc : mc;
        a.sort(e);
        var f = function (e) {
                function f(e, g) {
                    var k = p - e, t = p;
                    p -= e;
                    var s = a[k].name, k = new RBTree(c ? a[k] : s, b[s], g, null, d(k + 1, t));
                    l ? l.left = k : m = k;
                    l = k
                }

                for (var l = null, m = null, p = a.length, t = 0; t < e.count; ++t) {
                    var s = tc(e), w = Math.pow(2, e.count - (t + 1));
                    s ? f(w, !1) : (f(w, !1), f(w, !0))
                }
                return m
            }(new sc(a.length)),
            e = c ? lc : nc;
        return null !== f ? new FBComp(e, f) : new FBComp(e)
    }

    function fb_number_to_string(a) {
        return"number" === typeof a ? "number:" + ec(a) : "string:" + a
    }
    function FBDataSnapshot(a, b) {
        this._root = a;
        this._ref = b
    }

    FBDataSnapshot.prototype.val = function () {
        fb_check_args("Firebase.DataSnapshot.val", 0, 0, arguments.length);
        return this._root.val()
    };

    FBDataSnapshot.prototype.exportVal = function () {
        fb_check_args("Firebase.DataSnapshot.exportVal", 0, 0, arguments.length);
        return this._root.val(!0)
    };

    FBDataSnapshot.prototype.child = function (a) {
        fb_check_args("Firebase.DataSnapshot.child", 0, 1, arguments.length);
        isNumber(a) && (a = String(a));
        fb_check_path("Firebase.DataSnapshot.child", a);
        var b = new FBPath(a), c = this._ref.child(b);
        return new FBDataSnapshot(this._root.K(b), c)
    };

    FBDataSnapshot.prototype.hasChild = function (a) {
        fb_check_args("Firebase.DataSnapshot.hasChild", 1, 1, arguments.length);
        fb_check_path("Firebase.DataSnapshot.hasChild", a);
        var b = new FBPath(a);
        return!this._root.K(b).f()
    };

    FBDataSnapshot.prototype.getPriority = function () {
        fb_check_args("Firebase.DataSnapshot.getPriority", 0, 0, arguments.length);
        return this._root.getPriority()
    };

    FBDataSnapshot.prototype.forEach = function (a) {
        fb_check_args("Firebase.DataSnapshot.forEach", 1, 1, arguments.length);
        isValidFunction("Firebase.DataSnapshot.forEach", 1, a, !1);
        if (this._root.O())return!1;
        var b = this;
        return this._root.A(function (c, d) {
            return a(new FBDataSnapshot(d, b._ref.child(c)))
        })
    };

    FBDataSnapshot.prototype.hasChildren = function () {
        fb_check_args("Firebase.DataSnapshot.hasChildren", 0, 0, arguments.length);
        return this._root.O() ? !1 : !this._root.f()
    };

    FBDataSnapshot.prototype.name = function () {
        fb_check_args("Firebase.DataSnapshot.name", 0, 0, arguments.length);
        return this._ref.name()
    };

    FBDataSnapshot.prototype.numChildren = function () {
        fb_check_args("Firebase.DataSnapshot.numChildren", 0, 0, arguments.length);
        return this._root.numChildren()
    };

    FBDataSnapshot.prototype.ref = function () {
        fb_check_args("Firebase.DataSnapshot.ref", 0, 0, arguments.length);
        return this._ref
    };

    function uc(a) {
        fb_assert(isArray(a) && 0 < a.length, "Requires a non-empty array");
        this.Gd = a;
        this.xb = {}
    }

    uc.prototype.bd = function (a, b) {
        for (var c = this.xb[a] || [], d = 0; d < c.length; d++)c[d].aa.apply(c[d].Y, Array.prototype.slice.call(arguments, 1))
    };
    uc.prototype.on = function (a, b, c) {
        vc(this, a);
        this.xb[a] = this.xb[a] || [];
        this.xb[a].push({aa: b, Y: c});
        (a = this.kd(a)) && b.apply(c, a)
    };
    uc.prototype.off = function (a, b, c) {
        vc(this, a);
        a = this.xb[a] || [];
        for (var d = 0; d < a.length; d++)if (a[d].aa === b && (!c || c === a[d].Y)) {
            a.splice(d, 1);
            break
        }
    };
    function vc(a, b) {
        fb_assert(Db(a.Gd, function (a) {
            return a === b
        }), "Unknown event: " + b)
    };
    function wc() {
        uc.call(this, ["visible"]);
        var a, b;
        "undefined" !== typeof document && "undefined" !== typeof document.addEventListener && ("undefined" !== typeof document.hidden ? (b = "visibilitychange", a = "hidden") : "undefined" !== typeof document.mozHidden ? (b = "mozvisibilitychange", a = "mozHidden") : "undefined" !== typeof document.msHidden ? (b = "msvisibilitychange", a = "msHidden") : "undefined" !== typeof document.webkitHidden && (b = "webkitvisibilitychange", a = "webkitHidden"));
        this.lb = !0;
        if (b) {
            var c = this;
            document.addEventListener(b,
                function () {
                    var b = !document[a];
                    b !== c.lb && (c.lb = b, c.bd("visible", b))
                }, !1)
        }
    }

    ka(wc, uc);
    FBSingleton(wc);
    wc.prototype.kd = function (a) {
        fb_assert("visible" === a, "Unknown event type: " + a);
        return[this.lb]
    };
    function xc() {
        uc.call(this, ["online"]);
        this.Db = !0;
        if ("undefined" !== typeof window && "undefined" !== typeof window.addEventListener) {
            var a = this;
            window.addEventListener("online", function () {
                a.Db || a.bd("online", !0);
                a.Db = !0
            }, !1);
            window.addEventListener("offline", function () {
                a.Db && a.bd("online", !1);
                a.Db = !1
            }, !1)
        }
    }

    ka(xc, uc);
    FBSingleton(xc);
    xc.prototype.kd = function (a) {
        fb_assert("online" === a, "Unknown event type: " + a);
        return[this.Db]
    };
    function cc(a, b) {
        for (var c in a)b.call(void 0, a[c], c, a)
    }

    function yc(a) {
        var b = [], c = 0, d;
        for (d in a)b[c++] = d;
        return b
    }

    function fb_clone(a) {
        var b = {}, c;
        for (c in a)b[c] = a[c];
        return b
    };
    function FBInfo() {
        this.pb = {}
    }

    function fb_save_info_slot(a, b, c) {
        isDefined(c) || (c = 1);
        A(a.pb, b) || (a.pb[b] = 0);
        a.pb[b] += c
    }

    FBInfo.prototype.get = function () {
        return fb_clone(this.pb)
    };
    function Cc(a) {
        this.Id = a;
        this.Zb = null
    }

    Cc.prototype.get = function () {
        var a = this.Id.get(), b = fb_clone(a);
        if (this.Zb)for (var c in this.Zb)b[c] -= this.Zb[c];
        this.Zb = a;
        return b
    };
    function Dc(a, b) {
        this.Zc = {};
        this.tc = new Cc(a);
        this.u = b;
        var c = 1E4 + 2E4 * Math.random();
        setTimeout(r(this.td, this), Math.floor(c))
    }

    Dc.prototype.td = function () {
        var a = this.tc.get(), b = {}, c = !1, d;
        for (d in a)0 < a[d] && A(this.Zc, d) && (b[d] = a[d], c = !0);
        c && (a = this.u, a.R && (b = {c: b}, a._logger("reportStats", b), a.sendRequest_("s", b)));
        setTimeout(r(this.td, this), Math.floor(6E5 * Math.random()))
    };
    var Ec = {}, Fc = {};

    function fb_create_info_slot(a) {
        a = a.toString();
        Ec[a] || (Ec[a] = new FBInfo);
        return Ec[a]
    }

    function Hc(a, b) {
        var c = a.toString();
        Fc[c] || (Fc[c] = b());
        return Fc[c]
    }

    var WebSocketIMP = null;
    "undefined" !== typeof MozWebSocket ? WebSocketIMP = MozWebSocket : "undefined" !== typeof WebSocket && (WebSocketIMP = WebSocket);
    function FBSocket(a, b, c) {
        this._logPrefix = a;
        this._logger = Tb(this._logPrefix);
        this.frames = this.vb = null;
        this.Ha = this.Ia = this.ad = 0;
        this._info = fb_create_info_slot(b);
        this._url = (b.qc ? "wss://" : "ws://") + b.ga + "/.ws?v=5";
        b.host !== b.ga && (this._url = this._url + "&ns=" + b.bc);
        c && (this._url = this._url + "&s=" + c)
    }

    var Jc;
    FBSocket.prototype.open = function (a, b) {
        this.onDisconnect = b;
        this.Wd = a;
        this._logger("Websocket connecting to " + this._url);
        this._imp = new WebSocketIMP(this._url);
        this._connected = !1;
        FBLocalStorage.set("previous_websocket_failure", !0);
        var c = this;
        this._imp.onopen = function () {
            c._logger("Websocket connected.");
            c._connected = !0
        };
        this._imp.onclose = function () {
            c._logger("Websocket connection was disconnected.");
            c._imp = null;
            c.Pa()
        };
        this._imp.onmessage = function (a) {
            if (null !== c._imp)if (a = a.data, c.Ha += a.length, fb_save_info_slot(c._info, "bytes_received", a.length), Kc(c), null !== c.frames)Lc(c, a); else {
                a:{
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
        };
        this._imp.onerror = function (a) {
            c._logger("WebSocket error.  Closing connection.");
            (a = a.message || a.data) && c._logger(a);
            c.Pa()
        }
    };
    FBSocket.prototype.start = function () {
    };
    FBSocket.isAvailable = function () {
        var a = !1;
        if ("undefined" !== typeof navigator && navigator.userAgent) {
            var b = navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);
            b && 1 < b.length && 4.4 > parseFloat(b[1]) && (a = !0)
        }
        return!a && null !== WebSocketIMP && !Jc
    };
    FBSocket.responsesRequiredToBeHealthy = 2;
    FBSocket.healthyTimeout = 3E4;
    h = FBSocket.prototype;
    h.$b = function () {
        FBLocalStorage.remove("previous_websocket_failure")
    };
    function Lc(a, b) {
        a.frames.push(b);
        if (a.frames.length == a.ad) {
            var c = a.frames.join("");
            a.frames = null;
            c = JSONParse(c);
            a.Wd(c)
        }
    }

    h.send = function (a) {
        Kc(this);
        a = u(a);
        this.Ia += a.length;
        fb_save_info_slot(this._info, "bytes_sent", a.length);
        a = ac(a, 16384);
        1 < a.length && this._imp.send(String(a.length));
        for (var b = 0; b < a.length; b++)this._imp.send(a[b])
    };
    h._clearup = function () {
        this.Ma = !0;
        this.vb && (clearInterval(this.vb), this.vb = null);
        this._imp && (this._imp.close(), this._imp = null)
    };
    h.Pa = function () {
        this.Ma || (this._logger("WebSocket is closing itself"), this._clearup(), this.onDisconnect && (this.onDisconnect(this._connected), this.onDisconnect = null))
    };
    h.close = function () {
        this.Ma || (this._logger("WebSocket is being closed"), this._clearup())
    };
    function Kc(a) {
        clearInterval(a.vb);
        a.vb = setInterval(function () {
            a._imp && a._imp.send("0");
            Kc(a)
        }, Math.floor(45E3))
    };
    function Mc(a) {
        this.Pc = a;
        this.jc = [];
        this.Xa = 0;
        this.Bc = -1;
        this.Oa = null
    }

    function Nc(a, b, c) {
        a.Bc = b;
        a.Oa = c;
        a.Bc < a.Xa && (a.Oa(), a.Oa = null)
    }

    function Oc(a, b, c) {
        for (a.jc[b] = c; a.jc[a.Xa];) {
            var d = a.jc[a.Xa];
            delete a.jc[a.Xa];
            for (var e = 0; e < d.length; ++e)if (d[e]) {
                var f = a;
                fb_safe_exec(function () {
                    f.Pc(d[e])
                })
            }
            if (a.Xa === a.Bc) {
                a.Oa && (clearTimeout(a.Oa), a.Oa(), a.Oa = null);
                break
            }
            a.Xa++
        }
    };
    function Pc() {
        this.set = {}
    }

    h = Pc.prototype;
    h.add = function (a, b) {
        this.set[a] = null !== b ? b : !0
    };
    h.contains = function (a) {
        return A(this.set, a)
    };
    h.get = function (a) {
        return this.contains(a) ? this.set[a] : void 0
    };
    h.remove = function (a) {
        delete this.set[a]
    };
    h.f = function () {
        var a;
        a:{
            a = this.set;
            for (var b in a) {
                a = !1;
                break a
            }
            a = !0
        }
        return a
    };
    h.count = function () {
        var a = this.set, b = 0, c;
        for (c in a)b++;
        return b
    };
    function R(a, b) {
        cc(a.set, function (a, d) {
            b(d, a)
        })
    }

    h.keys = function () {
        var a = [];
        cc(this.set, function (b, c) {
            a.push(c)
        });
        return a
    };
    function FBLongPoll(a, b, c) {
        this._logPrefix = a;
        this._logger = Tb(a);
        this.Ha = this.Ia = 0;
        this._info = fb_create_info_slot(b);
        this.sc = c;
        this._connected = !1;
        this.Rb = function (a) {
            b.host !== b.ga && (a.ns = b.bc);
            var c = [], f;
            for (f in a)a.hasOwnProperty(f) && c.push(f + "=" + a[f]);
            return(b.qc ? "https://" : "http://") + b.ga + "/.lp?" + c.join("&")
        }
    }

    var Rc, kFBForeceWebSocket;
    FBLongPoll.prototype.open = function (a, b) {
        this.dd = 0;
        this.S = b;
        this.pd = new Mc(a);
        this.Ma = !1;
        var c = this;
        this.Ja = setTimeout(function () {
            c._logger("Timed out trying to connect.");
            c.Pa();
            c.Ja = null
        }, Math.floor(3E4));
        fb_call_on_loaded(function () {
            if (!c.Ma) {
                c.la = new Tc(function (a, b, d, k, l) {
                    Uc(c, arguments);
                    if (c.la)if (c.Ja && (clearTimeout(c.Ja), c.Ja = null), c._connected = !0, "start" == a)c.id = b, c.sd = d; else if ("close" === a)b ? (c.la.rc = !1, Nc(c.pd, b, function () {
                        c.Pa()
                    })) : c.Pa(); else throw Error("Unrecognized command received: " + a);
                }, function (a, b) {
                    Uc(c, arguments);
                    Oc(c.pd, a, b)
                }, function () {
                    c.Pa()
                }, c.Rb);
                var a = {start: "t"};
                a.ser = Math.floor(1E8 * Math.random());
                c.la.uc && (a.cb = c.la.uc);
                a.v = "5";
                c.sc && (a.s = c.sc);
                a = c.Rb(a);
                c._logger("Connecting via long-poll to " + a);
                Vc(c.la, a, function () {
                })
            }
        })
    };
    FBLongPoll.prototype.start = function () {
        var a = this.la, b = this.sd;
        a.Ud = this.id;
        a.Vd = b;
        for (a.xc = !0; Wc(a););
        a = this.id;
        b = this.sd;
        this.eb = document.createElement("iframe");
        var c = {dframe: "t"};
        c.id = a;
        c.pw = b;
        this.eb.src = this.Rb(c);
        this.eb.style.display = "none";
        document.body.appendChild(this.eb)
    };
    FBLongPoll.isAvailable = function () {
        return!kFBForeceWebSocket && !("object" === typeof window && window.chrome && window.chrome.extension && !/^chrome/.test(window.location.href)) && !("object" === typeof Windows && "object" === typeof Windows.je) && (Rc || !0)
    };
    h = FBLongPoll.prototype;
    FBLongPoll.prototype.$b = function () {
    };
    FBLongPoll.prototype._clearup = function () {
        this.Ma = !0;
        this.la && (this.la.close(), this.la = null);
        this.eb && (document.body.removeChild(this.eb), this.eb = null);
        this.Ja && (clearTimeout(this.Ja), this.Ja = null)
    };
    FBLongPoll.prototype.Pa = function () {
        this.Ma || (this._logger("Longpoll is closing itself"), this._clearup(), this.S && (this.S(this._connected), this.S = null))
    };
    FBLongPoll.prototype.close = function () {
        this.Ma || (this._logger("Longpoll is being closed."), this._clearup())
    };
    FBLongPoll.prototype.send = function (a) {
        a = u(a);
        this.Ia += a.length;
        fb_save_info_slot(this._info, "bytes_sent", a.length);
        a = stringToASCIIArray(a);
        if (!isArrayOrObject(a))throw Error("encodeByteArray takes an array as a parameter");
        if (!Mb) {
            Mb = {};
            Nb = {};
            for (var b = 0; 65 > b; b++)Mb[b] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(b), Nb[b] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(b)
        }
        for (var b = Nb, c = [], d = 0; d < a.length; d += 3) {
            var e = a[d], f = d + 1 < a.length, g = f ? a[d + 1] : 0, k = d + 2 < a.length, l = k ? a[d + 2] : 0, m = e >> 2, e = (e & 3) << 4 | g >> 4, g = (g & 15) <<
                2 | l >> 6, l = l & 63;
            k || (l = 64, f || (g = 64));
            c.push(b[m], b[e], b[g], b[l])
        }
        a = ac(c.join(""), 1840);
        for (b = 0; b < a.length; b++)c = this.la, c.Hb.push({de: this.dd, he: a.length, fd: a[b]}), c.xc && Wc(c), this.dd++
    };
    function Uc(a, b) {
        var c = u(b).length;
        a.Ha += c;
        fb_save_info_slot(a._info, "bytes_received", c)
    }

    function Tc(a, b, c, d) {
        this.Rb = d;
        this.onDisconnect = c;
        this.Rc = new Pc;
        this.Hb = [];
        this.Dc = Math.floor(1E8 * Math.random());
        this.rc = !0;
        this.uc = Ob();
        window["pLPCommand" + this.uc] = a;
        window["pRTLPCB" + this.uc] = b;
        a = document.createElement("iframe");
        a.style.display = "none";
        if (document.body) {
            document.body.appendChild(a);
            try {
                a.contentWindow.document || K("No IE domain setting required")
            } catch (e) {
                a.src = "javascript:void((function(){document.open();document.domain='" + document.domain + "';document.close();})())"
            }
        } else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
        a.contentDocument ? a.za = a.contentDocument : a.contentWindow ? a.za = a.contentWindow.document : a.document && (a.za = a.document);
        this.Z = a;
        a = "";
        this.Z.src && "javascript:" === this.Z.src.substr(0, 11) && (a = '<script>document.domain="' + document.domain + '";\x3c/script>');
        a = "<html><body>" + a + "</body></html>";
        try {
            this.Z.za.open(), this.Z.za.write(a), this.Z.za.close()
        } catch (f) {
            K("frame writing exception"), f.stack && K(f.stack), K(f)
        }
    }

    Tc.prototype.close = function () {
        this.xc = !1;
        if (this.Z) {
            this.Z.za.body.innerHTML = "";
            var a = this;
            setTimeout(function () {
                null !== a.Z && (document.body.removeChild(a.Z), a.Z = null)
            }, 0)
        }
        var b = this.onDisconnect;
        b && (this.onDisconnect = null, b())
    };
    function Wc(a) {
        if (a.xc && a.rc && a.Rc.count() < (0 < a.Hb.length ? 2 : 1)) {
            a.Dc++;
            var b = {};
            b.id = a.Ud;
            b.pw = a.Vd;
            b.ser = a.Dc;
            for (var b = a.Rb(b), c = "", d = 0; 0 < a.Hb.length;)if (1870 >= a.Hb[0].fd.length + 30 + c.length) {
                var e = a.Hb.shift(), c = c + "&seg" + d + "=" + e.de + "&ts" + d + "=" + e.he + "&d" + d + "=" + e.fd;
                d++
            } else break;
            Zc(a, b + c, a.Dc);
            return!0
        }
        return!1
    }

    function Zc(a, b, c) {
        function d() {
            a.Rc.remove(c);
            Wc(a)
        }

        a.Rc.add(c);
        var e = setTimeout(d, Math.floor(25E3));
        Vc(a, b, function () {
            clearTimeout(e);
            d()
        })
    }

    function Vc(a, b, c) {
        setTimeout(function () {
            try {
                if (a.rc) {
                    var d = a.Z.za.createElement("script");
                    d.type = "text/javascript";
                    d.async = !0;
                    d.src = b;
                    d.onload = d.onreadystatechange = function () {
                        var a = d.readyState;
                        a && "loaded" !== a && "complete" !== a || (d.onload = d.onreadystatechange = null, d.parentNode && d.parentNode.removeChild(d), c())
                    };
                    d.onerror = function () {
                        K("Long-poll script failed to load: " + b);
                        a.rc = !1;
                        a.close()
                    };
                    a.Z.za.body.appendChild(d)
                }
            } catch (e) {
            }
        }, Math.floor(1))
    }
    function $c(a) {
        ad(this, a)
    }

    var bd = [FBLongPoll, FBSocket];

    function ad(a, b) {
        var c = FBSocket && FBSocket.isAvailable(), d = c && !(FBLocalStorage.od || !0 === FBLocalStorage.get("previous_websocket_failure"));
        b.ie && (c || fb_warning("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."), d = !0);
        if (d)a.Ob = [FBSocket]; else {
            var e = a.Ob = [];
            bc(bd, function (a, b) {
                b && b.isAvailable() && e.push(b)
            })
        }
    }

    function cd(a) {
        if (0 < a.Ob.length)return a.Ob[0];
        throw Error("No transports available");
    };
    function RealTimeConnection(a, b, c, d, e, f) {
        this.id = a;
        this._logger = Tb("c:" + this.id + ":");
        this.Pc = c;
        this.Cb = d;
        this.S = e;
        this.Oc = f;
        this._url = b;
        this.ic = [];
        this.cd = 0;
        this.Cd = new $c(b);
        this.ma = 0;
        this._logger("Connection created");
        ed(this)
    }

    function ed(a) {
        var b = cd(a.Cd);
        a.B = new b("c:" + a.id + ":" + a.cd++, a._url);
        a.Tc = b.responsesRequiredToBeHealthy || 0;
        var c = fd(a, a.B), d = gd(a, a.B);
        a._socket = a.B;
        a.Mb = a.B;
        a.w = null;
        a.Na = !1;
        setTimeout(function () {
            a.B && a.B.open(c, d)
        }, 0);
        b = b.healthyTimeout || 0;
        0 < b && (a.Yb = setTimeout(function () {
            a.Yb = null;
            a.Na || (a.B && 102400 < a.B.Ha ? (a._logger("Connection exceeded healthy timeout but has received " + a.B.Ha + " bytes.  Marking connection healthy."), a.Na = !0, a.B.$b()) : a.B && 10240 < a.B.Ia ? a._logger("Connection exceeded healthy timeout but has sent " +
                a.B.Ia + " bytes.  Leaving connection alive.") : (a._logger("Closing unhealthy connection after timeout."), a.close()))
        }, Math.floor(b)))
    }

    function gd(a, b) {
        return function (c) {
            b === a.B ? (a.B = null, c || 0 !== a.ma ? 1 === a.ma && a._logger("Realtime connection lost.") : (a._logger("Realtime connection failed."), "s-" === a._url.ga.substr(0, 2) && (FBLocalStorage.remove("host:" + a._url.host), a._url.ga = a._url.host)), a.close()) : b === a.w ? (a._logger("Secondary connection lost."), c = a.w, a.w = null, a._socket !== c && a.Mb !== c || a.close()) : a._logger("closing an old connection")
        }
    }

    function fd(a, b) {
        return function (c) {
            if (2 != a.ma)if (b === a.Mb) {
                var d = $b("t", c);
                c = $b("d", c);
                if ("c" == d) {
                    if (d = $b("t", c), "d"in c)if (c = c.d, "h" === d) {
                        var d = c.ts, e = c.v, f = c.h;
                        a.sc = c.s;
                        qb(a._url, f);
                        0 == a.ma && (a.B.start(), hd(a, a.B, d), "5" !== e && fb_warning("Protocol version mismatch detected"), c = a.Cd, (c = 1 < c.Ob.length ? c.Ob[1] : null) && id(a, c))
                    } else if ("n" === d) {
                        a._logger("recvd end transmission on primary");
                        a.Mb = a.w;
                        for (c = 0; c < a.ic.length; ++c)a.gc(a.ic[c]);
                        a.ic = [];
                        jd(a)
                    } else"s" === d ? (a._logger("Connection shutdown command received. Shutting down..."),
                        a.Oc && (a.Oc(c), a.Oc = null), a.S = null, a.close()) : "r" === d ? (a._logger("Reset packet received.  New host: " + c), qb(a._url, c), 1 === a.ma ? a.close() : (FBShutdownAllConnections(a), ed(a))) : "e" === d ? fb_log_error("Server Error: " + c) : "o" === d ? (a._logger("got pong on primary."), ld(a), fb_send_ping(a)) : fb_log_error("Unknown control packet command: " + d)
                } else"d" == d && a.gc(c)
            } else if (b === a.w)if (d = $b("t", c), c = $b("d", c), "c" == d)"t"in c && (c = c.t, "a" === c ? nd(a) : "r" === c ? (a._logger("Got a reset on secondary, closing it"), a.w.close(), a._socket !== a.w && a.Mb !== a.w || a.close()) : "o" === c && (a._logger("got pong on secondary."),
                a.xd--, nd(a))); else if ("d" == d)a.ic.push(c); else throw Error("Unknown protocol layer: " + d); else a._logger("message on old connection")
        }
    }

    RealTimeConnection.prototype.yd = function (a) {
        od(this, {t: "d", d: a})
    };
    function jd(a) {
        a._socket === a.w && a.Mb === a.w && (a._logger("cleaning up and promoting a connection: " + a.w._logPrefix), a.B = a.w, a.w = null)
    }

    function nd(a) {
        0 >= a.xd ? (a._logger("Secondary connection is healthy."), a.Na = !0, a.w.$b(), a.w.start(), a._logger("sending client ack on secondary"), a.w.send({t: "c", d: {t: "a", d: {}}}), a._logger("Ending transmission on primary"), a.B.send({t: "c", d: {t: "n", d: {}}}), a._socket = a.w, jd(a)) : (a._logger("sending ping on secondary."), a.w.send({t: "c", d: {t: "p", d: {}}}))
    }

    RealTimeConnection.prototype.gc = function (a) {
        ld(this);
        this.Pc(a)
    };
    function ld(a) {
        a.Na || (a.Tc--, 0 >= a.Tc && (a._logger("Primary connection is healthy."), a.Na = !0, a.B.$b()))
    }

    function id(a, b) {
        a.w = new b("c:" + a.id + ":" + a.cd++, a._url, a.sc);
        a.xd = b.responsesRequiredToBeHealthy || 0;
        a.w.open(fd(a, a.w), gd(a, a.w));
        setTimeout(function () {
            a.w && (a._logger("Timed out trying to upgrade."), a.w.close())
        }, Math.floor(6E4))
    }

    function hd(a, b, c) {
        a._logger("Realtime connection established.");
        a.B = b;
        a.ma = 1;
        a.Cb && (a.Cb(c), a.Cb = null);
        0 === a.Tc ? (a._logger("Primary connection is healthy."), a.Na = !0) : setTimeout(function () {
            fb_send_ping(a)
        }, Math.floor(5E3))
    }

    function fb_send_ping(a) {
        a.Na || 1 !== a.ma || (a._logger("sending ping on primary."), od(a, {t: "c", d: {t: "p", d: {}}}))
    }

    function od(a, b) {
        if (1 !== a.ma)throw"Connection is not connected";
        a._socket.send(b)
    }

    RealTimeConnection.prototype.close = function () {
        2 !== this.ma && (this._logger("Closing realtime connection."), this.ma = 2, FBShutdownAllConnections(this), this.S && (this.S(), this.S = null))
    };
    function FBShutdownAllConnections(a) {
        a._logger("Shutting down all connections");
        a.B && (a.B.close(), a.B = null);
        a.w && (a.w.close(), a.w = null);
        a.Yb && (clearTimeout(a.Yb), a.Yb = null)
    };
    function FBDataConnection(a, b, c, d, e, f) {
        this.id = qd++;
        this._logger = Tb("p:" + this.id + ":");
        this.Sa = !0;
        this.ha = {};
        this.T = [];
        this.Eb = 0;
        this.Bb = [];
        this.R = !1;
        this.sa = 1E3;
        this.ac = 3E5;
        this.hc = b || ba;
        this.fc = c || ba;
        this.Ab = d || ba;
        this.Qc = e || ba;
        this.Hc = f || ba;
        this._url = a;
        this.Vc = null;
        this.Lb = {};
        this.ce = 0;
        this.wb = this.Lc = null;
        rd(this, 0);
        wc.sharedInstance().on("visible", this.Yd, this);
        -1 === a.host.indexOf("fblocal") && xc.sharedInstance().on("online", this.Xd, this)
    }

    var qd = 0, sd = 0;

    FBDataConnection.prototype.sendRequest_ = function (a, b, c) {
        var d = ++this.ce;
        a = {r: d, a: a, b: b};
        this._logger(u(a));
        fb_assert(this.R, "sendRequest_ call when we're not connected not allowed.");
        this.ka.yd(a);
        c && (this.Lb[d] = c)
    };
    function fb_listen(a, b, c) {
        var d = b.toString(), e = b.path().toString();
        a.ha[e] = a.ha[e] || {};
        fb_assert(!a.ha[e][d], "listen() called twice for same path/queryId.");
        a.ha[e][d] = {hb: b.hb(), D: c};
        a.R && fb_listen_on(a, e, d, b.hb(), c)
    }

    function fb_listen_on(a, b, c, d, e) {
        a._logger("Listen on " + b + " for " + c);
        var f = {p: b};
        d = Ab(d, function (a) {
            return Ka(a)
        });
        "{}" !== c && (f.q = d);
        f.h = a.Hc(b);
        a.sendRequest_("l", f, function (d) {
            a._logger("listen response", d);
            d = d.s;
            "ok" !== d && vd(a, b, c);
            e && e(d)
        })
    }

    FBDataConnection.prototype.auth = function (a, b, c) {
        this.Ka = {Jd: a, hd: !1, aa: b, Ub: c};
        this._logger("Authenticating using credential: " + this.Ka);
        wd(this);
        if (!(b = 40 == a.length))a:{
            var d;
            try {
                var e = a.split(".");
                if (3 !== e.length) {
                    b = !1;
                    break a
                }
                var f;
                b:{
                    try {
                        if ("undefined" !== typeof atob) {
                            f = atob(e[1]);
                            break b
                        }
                    } catch (g) {
                        K("base64DecodeIfNativeSupport failed: ", g)
                    }
                    f = null
                }
                null !== f && (d = JSONParse(f))
            } catch (k) {
                K("isAdminAuthToken_ failed", k)
            }
            b = "object" === typeof d && !0 === fb_getProperty(d, "admin")
        }
        b && (this._logger("Admin auth credential detected.  Reducing max reconnect time."), this.ac =
            3E4)
    };
    FBDataConnection.prototype.unauth = function (a) {
        delete this.Ka;
        this.Ab(!1);
        this.R && this.sendRequest_("unauth", {}, function (b) {
            a(b.s, b.d)
        })
    };
    function wd(a) {
        var b = a.Ka;
        a.R && b && a.sendRequest_("auth", {cred: b.Jd}, function (c) {
            var d = c.s;
            c = c.d || "error";
            "ok" !== d && a.Ka === b && delete a.Ka;
            a.Ab("ok" === d);
            b.hd ? "ok" !== d && b.Ub && b.Ub(d, c) : (b.hd = !0, b.aa && b.aa(d, c))
        })
    }

    function xd(a, b, c, d) {
        b = b.toString();
        vd(a, b, c) && a.R && yd(a, b, c, d)
    }

    function yd(a, b, c, d) {
        a._logger("Unlisten on " + b + " for " + c);
        b = {p: b};
        d = Ab(d, function (a) {
            return Ka(a)
        });
        "{}" !== c && (b.q = d);
        a.sendRequest_("u", b)
    }

    function zd(a, b, c, d) {
        a.R ? Ad(a, "o", b, c, d) : a.Bb.push({Sc: b, action: "o", data: c, D: d})
    }

    function Bd(a, b, c, d) {
        a.R ? Ad(a, "om", b, c, d) : a.Bb.push({Sc: b, action: "om", data: c, D: d})
    }

    FBDataConnection.prototype.Nc = function (a, b) {
        this.R ? Ad(this, "oc", a, null, b) : this.Bb.push({Sc: a, action: "oc", data: null, D: b})
    };
    function Ad(a, b, c, d, e) {
        c = {p: c, d: d};
        a._logger("onDisconnect " + b, c);
        a.sendRequest_(b, c, function (a) {
            e && setTimeout(function () {
                e(a.s, a.d)
            }, 0)
        })
    }

    FBDataConnection.prototype.put = function (a, b, c, d) {
        Cd(this, "p", a, b, c, d)
    };
    function Dd(a, b, c, d) {
        Cd(a, "m", b, c, d, void 0)
    }

    function Cd(a, b, c, d, e, f) {
        c = {p: c, d: d};
        isDefined(f) && (c.h = f);
        a.T.push({action: b, ud: c, D: e});
        a.Eb++;
        b = a.T.length - 1;
        a.R && Ed(a, b)
    }

    function Ed(a, b) {
        var c = a.T[b].action, d = a.T[b].ud, e = a.T[b].D;
        a.T[b].$d = a.R;
        a.sendRequest_(c, d, function (d) {
            a._logger(c + " response", d);
            delete a.T[b];
            a.Eb--;
            0 === a.Eb && (a.T = []);
            e && e(d.s, d.d)
        })
    }

    FBDataConnection.prototype.gc = function (a) {
        if ("r"in a) {
            this._logger("from server: " + u(a));
            var b = a.r, c = this.Lb[b];
            c && (delete this.Lb[b], c(a.b))
        } else {
            if ("error"in a)throw"A server-side error has occurred: " + a.error;
            "a"in a && (b = a.a, c = a.b, this._logger("handleServerMessage", b, c), "d" === b ? this.hc(c.p, c.d, !1) : "m" === b ? this.hc(c.p, c.d, !0) : "c" === b ? Fd(this, c.p, c.q) : "ac" === b ? (a = c.s, b = c.d, c = this.Ka, delete this.Ka, c && c.Ub && c.Ub(a, b), this.Ab(!1)) : "sd" === b ? this.Vc ? this.Vc(c) : "msg"in c && "undefined" !== typeof console && console.log("FIREBASE: " + c.msg.replace("\n",
                "\nFIREBASE: ")) : fb_log_error("Unrecognized action received from server: " + u(b) + "\nAre you using the latest client?"))
        }
    };
    FBDataConnection.prototype.Cb = function (a) {
        this._logger("connection ready");
        this.R = !0;
        this.wb = (new Date).getTime();
        this.Qc({serverTimeOffset: a - (new Date).getTime()});
        wd(this);
        for (var b in this.ha)for (var c in this.ha[b])a = this.ha[b][c], fb_listen_on(this, b, c, a.hb, a.D);
        for (b = 0; b < this.T.length; b++)this.T[b] && Ed(this, b);
        for (; this.Bb.length;)b = this.Bb.shift(), Ad(this, b.action, b.Sc, b.data, b.D);
        this.fc(!0)
    };
    function rd(a, b) {
        fb_assert(!a.ka, "Scheduling a connect when we're already connected/ing?");
        a.Za && clearTimeout(a.Za);
        a.Za = setTimeout(function () {
            a.Za = null;
            Gd(a)
        }, Math.floor(b))
    }

    FBDataConnection.prototype.Yd = function (a) {
        a && !this.lb && this.sa === this.ac && (this._logger("Window became visible.  Reducing delay."), this.sa = 1E3, this.ka || rd(this, 0));
        this.lb = a
    };
    FBDataConnection.prototype.Xd = function (a) {
        a ? (this._logger("Browser went online.  Reconnecting."), this.sa = 1E3, this.Sa = !0, this.ka || rd(this, 0)) : (this._logger("Browser went offline.  Killing connection; don't reconnect."), this.Sa = !1, this.ka && this.ka.close())
    };
    FBDataConnection.prototype.qd = function () {
        this._logger("data client disconnected");
        this.R = !1;
        this.ka = null;
        for (var a = 0; a < this.T.length; a++) {
            var b = this.T[a];
            b && "h"in b.ud && b.$d && (b.D && b.D("disconnect"), delete this.T[a], this.Eb--)
        }
        0 === this.Eb && (this.T = []);
        if (this.Sa)this.lb ? this.wb && (3E4 < (new Date).getTime() - this.wb && (this.sa = 1E3), this.wb = null) : (this._logger("Window isn't visible.  Delaying reconnect."), this.sa = this.ac, this.Lc = (new Date).getTime()), a = Math.max(0, this.sa - ((new Date).getTime() - this.Lc)), a *= Math.random(), this._logger("Trying to reconnect in " +
            a + "ms"), rd(this, a), this.sa = Math.min(this.ac, 1.3 * this.sa); else for (var c in this.Lb)delete this.Lb[c];
        this.fc(!1)
    };
    function Gd(a) {
        if (a.Sa) {
            a._logger("Making a connection attempt");
            a.Lc = (new Date).getTime();
            a.wb = null;
            var b = r(a.gc, a), c = r(a.Cb, a), d = r(a.qd, a), e = a.id + ":" + sd++;
            a.ka = new RealTimeConnection(e, a._url, b, c, d, function (b) {
                fb_warning(b + " (" + a._url.toString() + ")");
                a.Sa = !1
            })
        }
    }

    FBDataConnection.prototype.interrupt = function () {
        this.Sa = !1;
        this.ka ? this.ka.close() : (this.Za && (clearTimeout(this.Za), this.Za = null), this.R && this.qd())
    };
    FBDataConnection.prototype.resume = function () {
        this.Sa = !0;
        this.sa = 1E3;
        this.R || rd(this, 0)
    };
    function Fd(a, b, c) {
        c = c ? Ab(c,function (a) {
            return La(a)
        }).join("$") : "{}";
        (a = vd(a, b, c)) && a.D && a.D("permission_denied")
    }

    function vd(a, b, c) {
        b = (new FBPath(b)).toString();
        c || (c = "{}");
        var d = a.ha[b][c];
        delete a.ha[b][c];
        return d
    };
    function Hd() {
        this.n = this.F = null
    }

    function Id(a, b, c) {
        if (b.f())a.F = c, a.n = null; else if (null !== a.F)a.F = a.F.ya(b, c); else {
            null == a.n && (a.n = new Pc);
            var d = fb_safe_get_subpath(b);
            a.n.contains(d) || a.n.add(d, new Hd);
            a = a.n.get(d);
            b = fb_next_level_path(b);
            Id(a, b, c)
        }
    }

    function Jd(a, b) {
        if (b.f())return a.F = null, a.n = null, !0;
        if (null !== a.F) {
            if (a.F.O())return!1;
            var c = a.F;
            a.F = null;
            c.A(function (b, c) {
                Id(a, new FBPath(b), c)
            });
            return Jd(a, b)
        }
        return null !== a.n ? (c = fb_safe_get_subpath(b), b = fb_next_level_path(b), a.n.contains(c) && Jd(a.n.get(c), b) && a.n.remove(c), a.n.f() ? (a.n = null, !0) : !1) : !0
    }

    function Kd(a, b, c) {
        null !== a.F ? c(b, a.F) : a.A(function (a, e) {
            var f = new FBPath(b.toString() + "/" + a);
            Kd(e, f, c)
        })
    }

    Hd.prototype.A = function (a) {
        null !== this.n && R(this.n, function (b, c) {
            a(b, c)
        })
    };
    function Ld() {
        this.$ = kFBGlobalNode
    }

    function S(a, b) {
        return a.$.K(b)
    }

    function T(a, b, c) {
        a.$ = a.$.ya(b, c)
    }

    Ld.prototype.toString = function () {
        return this.$.toString()
    };
    function Md() {
        this.ta = new Ld;
        this.L = new Ld;
        this.oa = new Ld;
        this.Gb = new FBTree
    }

    function Nd(a, b, c) {
        T(a.ta, b, c);
        return Od(a, b)
    }

    function Od(a, b) {
        for (var c = S(a.ta, b), d = S(a.L, b), e = I(a.Gb, b), f = !1, g = e; null !== g;) {
            if (null !== g.j()) {
                f = !0;
                break
            }
            g = g.parent()
        }
        if (f)return!1;
        c = Pd(c, d, e);
        return c !== d ? (T(a.L, b, c), !0) : !1
    }

    function Pd(a, b, c) {
        if (c.f())return a;
        if (null !== c.j())return b;
        a = a || kFBGlobalNode;
        c.A(function (d) {
            d = d.name();
            var e = a.N(d), f = b.N(d), g = I(c, d), e = Pd(e, f, g);
            a = a.H(d, e)
        });
        return a
    }

    Md.prototype.set = function (a, b) {
        var c = this, d = [];
        zb(b, function (a) {
            var b = a.path;
            a = a.ra;
            var g = Ob();
            J(I(c.Gb, b), g);
            T(c.L, b, a);
            d.push({path: b, ee: g})
        });
        return d
    };
    function Qd(a, b) {
        zb(b, function (b) {
            var d = b.ee;
            b = I(a.Gb, b.path);
            var e = b.j();
            fb_assert(null !== e, "pendingPut should not be null.");
            e === d && J(b, null)
        })
    };
    function Rd(a, b) {
        return a && "object" === typeof a ? (fb_assert(".sv"in a, "Unexpected leaf node or priority contents"), b[a[".sv"]]) : a
    }

    function Sd(a, b) {
        var c = new Hd;
        Kd(a, new FBPath(""), function (a, e) {
            Id(c, a, Td(e, b))
        });
        return c
    }

    function Td(a, b) {
        var c = Rd(a.getPriority(), b), d;
        if (a.O()) {
            var e = Rd(a.j(), b);
            return e !== a.j() || c !== a.getPriority() ? new FBLeafNode(e, c) : a
        }
        d = a;
        c !== a.getPriority() && (d = d.copy(c));
        a.A(function (a, c) {
            var e = Td(c, b);
            e !== c && (d = d.H(a, e))
        });
        return d
    };
    function Ud() {
        this.$a = []
    }

    function Vd(a, b) {
        if (0 !== b.length)for (var c = 0; c < b.length; c++)a.$a.push(b[c])
    }

    Ud.prototype.Jb = function () {
        for (var a = 0; a < this.$a.length; a++)if (this.$a[a]) {
            var b = this.$a[a];
            this.$a[a] = null;
            Wd(b)
        }
        this.$a = []
    };
    function Wd(a) {
        var b = a.aa, c = a.zd, d = a.Ib;
        fb_safe_exec(function () {
            b(c, d)
        })
    };
    function U(a, b, c, d) {
        this.type = a;
        this.ua = b;
        this.ba = c;
        this.Ib = d
    };
    function Xd(a) {
        this.Q = a;
        this.pa = [];
        this.Ec = new Ud
    }

    function Yd(a, b, c, d, e) {
        a.pa.push({type: b, aa: c, cancel: d, Y: e});
        d = [];
        var f = Zd(a.i);
        a.ub && f.push(new U("value", a.i));
        for (var g = 0; g < f.length; g++)if (f[g].type === b) {
            var k = new Firebase(a.Q.m, a.Q.path);
            f[g].ba && (k = k.child(f[g].ba));
            d.push({aa: dc(c, e), zd: new FBDataSnapshot(f[g].ua, k), Ib: f[g].Ib})
        }
        Vd(a.Ec, d)
    }

    Xd.prototype.lc = function (a, b) {
        b = this.mc(a, b);
        null != b && $d(this, b)
    };
    function $d(a, b) {
        for (var c = [], d = 0; d < b.length; d++) {
            var e = b[d], f = e.type, g = new Firebase(a.Q.m, a.Q.path);
            b[d].ba && (g = g.child(b[d].ba));
            g = new FBDataSnapshot(b[d].ua, g);
            "value" !== e.type || g.hasChildren() ? "value" !== e.type && (f += " " + g.name()) : f += "(" + g.val() + ")";
            K(a.Q.m.u.id + ": event:" + a.Q.path + ":" + a.Q.queryIdentifier() + ":" + f);
            for (f = 0; f < a.pa.length; f++) {
                var k = a.pa[f];
                b[d].type === k.type && c.push({aa: dc(k.aa, k.Y), zd: g, Ib: e.Ib})
            }
        }
        Vd(a.Ec, c)
    }

    Xd.prototype.Jb = function () {
        this.Ec.Jb()
    };
    function Zd(a) {
        var b = [];
        if (!a.O()) {
            var c = null;
            a.A(function (a, e) {
                b.push(new U("child_added", e, a, c));
                c = a
            })
        }
        return b
    }

    function ae(a) {
        a.ub || (a.ub = !0, $d(a, [new U("value", a.i)]))
    };
    function be(a, b) {
        Xd.call(this, a);
        this.i = b
    }

    ka(be, Xd);
    be.prototype.mc = function (a, b) {
        this.i = a;
        this.ub && null != b && b.push(new U("value", this.i));
        return b
    };
    be.prototype.rb = function () {
        return{}
    };
    function ce(a, b) {
        this.Wb = a;
        this.Mc = b
    }

    function de(a, b, c, d, e) {
        var f = a.K(c), g = b.K(c);
        d = new ce(d, e);
        e = ee(d, c, f, g);
        g = !f.f() && !g.f() && f.getPriority() !== g.getPriority();
        if (e || g)for (f = c, c = e; null !== f.parent();) {
            var k = a.K(f);
            e = b.K(f);
            var l = f.parent();
            if (!d.Wb || I(d.Wb, l).j()) {
                var m = b.K(l), p = [], f = Na(f);
                k.f() ? (k = m.fa(f, e), p.push(new U("child_added", e, f, k))) : e.f() ? p.push(new U("child_removed", k, f)) : (k = m.fa(f, e), g && p.push(new U("child_moved", e, f, k)), c && p.push(new U("child_changed", e, f, k)));
                d.Mc(l, m, p)
            }
            g && (g = !1, c = !0);
            f = l
        }
    }

    function ee(a, b, c, d) {
        var e, f = [];
        c === d ? e = !1 : c.O() && d.O() ? e = c.j() !== d.j() : c.O() ? (fe(a, b, kFBGlobalNode, d, f), e = !0) : d.O() ? (fe(a, b, c, kFBGlobalNode, f), e = !0) : e = fe(a, b, c, d, f);
        e ? a.Mc(b, d, f) : c.getPriority() !== d.getPriority() && a.Mc(b, d, null);
        return e
    }

    function fe(a, b, c, d, e) {
        var f = !1, g = !a.Wb || !I(a.Wb, b).f(), k = [], l = [], m = [], p = [], t = {}, s = {}, w, V, G, H;
        w = c.ab();
        G = Za(w);
        V = d.ab();
        for (H = Za(V); null !== G || null !== H;) {
            c = H;
            c = null === G ? 1 : null === c ? -1 : G.key === c.key ? 0 : lc({name: G.key, ja: G.value.getPriority()}, {name: c.key, ja: c.value.getPriority()});
            if (0 > c)f = fb_getProperty(t, G.key), isDefined(f) ? (m.push({Gc: G, $c: k[f]}), k[f] = null) : (s[G.key] = l.length, l.push(G)), f = !0, G = Za(w); else {
                if (0 < c)f = fb_getProperty(s, H.key), isDefined(f) ? (m.push({Gc: l[f], $c: H}), l[f] = null) : (t[H.key] = k.length, k.push(H)), f = !0; else {
                    c = b.child(H.key);
                    if (c = ee(a, c, G.value,
                        H.value))p.push(H), f = !0;
                    G.value.getPriority() !== H.value.getPriority() && (m.push({Gc: G, $c: H}), f = !0);
                    G = Za(w)
                }
                H = Za(V)
            }
            if (!g && f)return!0
        }
        for (g = 0; g < l.length; g++)if (t = l[g])c = b.child(t.key), ee(a, c, t.value, kFBGlobalNode), e.push(new U("child_removed", t.value, t.key));
        for (g = 0; g < k.length; g++)if (t = k[g])c = b.child(t.key), l = d.fa(t.key, t.value), ee(a, c, kFBGlobalNode, t.value), e.push(new U("child_added", t.value, t.key, l));
        for (g = 0; g < m.length; g++)t = m[g].Gc, k = m[g].$c, c = b.child(k.key), l = d.fa(k.key, k.value), e.push(new U("child_moved", k.value, k.key, l)), (c = ee(a, c, t.value, k.value)) &&
            p.push(k);
        for (g = 0; g < p.length; g++)a = p[g], l = d.fa(a.key, a.value), e.push(new U("child_changed", a.value, a.key, l));
        return f
    };
    function ge() {
        this.X = this.xa = null;
        this.set = {}
    }

    ka(ge, Pc);
    h = ge.prototype;
    h.setActive = function (a) {
        this.xa = a
    };
    function he(a, b, c) {
        a.add(b, c);
        a.X || (a.X = c.Q.path)
    }

    function ie(a) {
        var b = a.xa;
        a.xa = null;
        return b
    }

    function je(a) {
        return a.contains("default")
    }

    function ke(a) {
        return null != a.xa && je(a)
    }

    h.defaultView = function () {
        return je(this) ? this.get("default") : null
    };
    h.path = function () {
        return this.X
    };
    h.toString = function () {
        return Ab(this.keys(),function (a) {
            return"default" === a ? "{}" : a
        }).join("$")
    };
    h.hb = function () {
        var a = [];
        R(this, function (b, c) {
            a.push(c.Q)
        });
        return a
    };
    function le(a, b) {
        Xd.call(this, a);
        this.i = kFBGlobalNode;
        this.mc(b, Zd(b))
    }

    ka(le, Xd);
    le.prototype.mc = function (a, b) {
        if (null === b)return b;
        var c = [], d = this.Q;
        isDefined(d.da) && (isDefined(d.wa) && null != d.wa ? c.push(function (a, b) {
            var c = Xb(b, d.da);
            return 0 < c || 0 === c && 0 <= Yb(a, d.wa)
        }) : c.push(function (a, b) {
            return 0 <= Xb(b, d.da)
        }));
        isDefined(d.Aa) && (isDefined(d.Ya) ? c.push(function (a, b) {
            var c = Xb(b, d.Aa);
            return 0 > c || 0 === c && 0 >= Yb(a, d.Ya)
        }) : c.push(function (a, b) {
            return 0 >= Xb(b, d.Aa)
        }));
        var e = null, f = null;
        if (isDefined(this.Q.Ca))if (isDefined(this.Q.da)) {
            if (e = me(a, c, this.Q.Ca, !1)) {
                var g = a.N(e).getPriority();
                c.push(function (a, b) {
                    var c = Xb(b, g);
                    return 0 > c || 0 === c &&
                        0 >= Yb(a, e)
                })
            }
        } else if (f = me(a, c, this.Q.Ca, !0)) {
            var k = a.N(f).getPriority();
            c.push(function (a, b) {
                var c = Xb(b, k);
                return 0 < c || 0 === c && 0 <= Yb(a, f)
            })
        }
        for (var l = [], m = [], p = [], t = [], s = 0; s < b.length; s++) {
            var w = b[s].ba, V = b[s].ua;
            switch (b[s].type) {
                case "child_added":
                    ne(c, w, V) && (this.i = this.i.H(w, V), m.push(b[s]));
                    break;
                case "child_removed":
                    this.i.N(w).f() || (this.i = this.i.H(w, null), l.push(b[s]));
                    break;
                case "child_changed":
                    !this.i.N(w).f() && ne(c, w, V) && (this.i = this.i.H(w, V), t.push(b[s]));
                    break;
                case "child_moved":
                    var G = !this.i.N(w).f(),
                        H = ne(c, w, V);
                    G ? H ? (this.i = this.i.H(w, V), p.push(b[s])) : (l.push(new U("child_removed", this.i.N(w), w)), this.i = this.i.H(w, null)) : H && (this.i = this.i.H(w, V), m.push(b[s]))
            }
        }
        var Xc = e || f;
        if (Xc) {
            var Yc = (s = null !== f) ? this.i.jd() : this.i.ld(), hc = !1, ab = !1, bb = this;
            (s ? a.Fc : a.A).call(a, function (a, b) {
                ab || null !== Yc || (ab = !0);
                if (ab && hc)return!0;
                hc ? (l.push(new U("child_removed", bb.i.N(a), a)), bb.i = bb.i.H(a, null)) : ab && (m.push(new U("child_added", b, a)), bb.i = bb.i.H(a, b));
                Yc === a && (ab = !0);
                a === Xc && (hc = !0)
            })
        }
        for (s = 0; s < m.length; s++)c =
            m[s], w = this.i.fa(c.ba, c.ua), l.push(new U("child_added", c.ua, c.ba, w));
        for (s = 0; s < p.length; s++)c = p[s], w = this.i.fa(c.ba, c.ua), l.push(new U("child_moved", c.ua, c.ba, w));
        for (s = 0; s < t.length; s++)c = t[s], w = this.i.fa(c.ba, c.ua), l.push(new U("child_changed", c.ua, c.ba, w));
        this.ub && 0 < l.length && l.push(new U("value", this.i));
        return l
    };
    function me(a, b, c, d) {
        if (a.O())return null;
        var e = null;
        (d ? a.Fc : a.A).call(a, function (a, d) {
            if (ne(b, a, d) && (e = a, c--, 0 === c))return!0
        });
        return e
    }

    function ne(a, b, c) {
        for (var d = 0; d < a.length; d++)if (!a[d](b, c.getPriority()))return!1;
        return!0
    }

    le.prototype.hasChild = function (a) {
        return this.i.N(a) !== kFBGlobalNode
    };
    le.prototype.rb = function (a, b, c) {
        var d = {};
        this.i.O() || this.i.A(function (a) {
            d[a] = 3
        });
        var e = this.i;
        c = S(c, new FBPath(""));
        var f = new FBTree;
        J(I(f, this.Q.path), !0);
        b = kFBGlobalNode.ya(a, b);
        var g = this;
        de(c, b, a, f, function (a, b, c) {
            null !== c && a.toString() === g.Q.path.toString() && g.mc(b, c)
        });
        this.i.O() ? cc(d, function (a, b) {
            d[b] = 2
        }) : (this.i.A(function (a) {
            A(d, a) || (d[a] = 1)
        }), cc(d, function (a, b) {
            g.i.N(b).f() && (d[b] = 2)
        }));
        this.i = e;
        return d
    };
    function oe(a, b) {
        this.u = a;
        this.g = b;
        this.ec = b.$;
        this.na = new FBTree
    }

    oe.prototype.Sb = function (a, b, c, d, e) {
        var f = a.path, g = I(this.na, f), k = g.j();
        null === k ? (k = new ge, J(g, k)) : fb_assert(!k.f(), "We shouldn't be storing empty QueryMaps");
        var l = a.queryIdentifier();
        if (k.contains(l))a = k.get(l), Yd(a, b, c, d, e); else {
            var m = this.g.$.K(f);
            a = pe(a, m);
            qe(this, g, k, l, a);
            Yd(a, b, c, d, e);
            (b = (b = Ta(I(this.na, f), function (a) {
                var b;
                if (b = a.j() && a.j().defaultView())b = a.j().defaultView().ub;
                if (b)return!0
            }, !0)) || null === this.u && !S(this.g, f).f()) && ae(a)
        }
        a.Jb()
    };
    function re(a, b, c, d, e) {
        var f = a.get(b), g;
        if (g = f) {
            g = !1;
            for (var k = f.pa.length - 1; 0 <= k; k--) {
                var l = f.pa[k];
                if (!(c && l.type !== c || d && l.aa !== d || e && l.Y !== e) && (f.pa.splice(k, 1), g = !0, c && d))break
            }
        }
        (c = g && !(0 < f.pa.length)) && a.remove(b);
        return c
    }

    function se(a, b, c, d, e) {
        b = b ? b.queryIdentifier() : null;
        var f = [];
        b && "default" !== b ? re(a, b, c, d, e) && f.push(b) : zb(a.keys(), function (b) {
            re(a, b, c, d, e) && f.push(b)
        });
        return f
    }

    oe.prototype.oc = function (a, b, c, d) {
        var e = I(this.na, a.path).j();
        return null === e ? null : te(this, e, a, b, c, d)
    };
    function te(a, b, c, d, e, f) {
        var g = b.path(), g = I(a.na, g);
        c = se(b, c, d, e, f);
        b.f() && J(g, null);
        d = ue(g);
        if (0 < c.length && !d) {
            d = g;
            e = g.parent();
            for (c = !1; !c && e;) {
                if (f = e.j()) {
                    fb_assert(!ke(f));
                    var k = d.name(), l = !1;
                    R(f, function (a, b) {
                        l = b.hasChild(k) || l
                    });
                    l && (c = !0)
                }
                d = e;
                e = e.parent()
            }
            d = null;
            ke(b) || (b = ie(b), d = ve(a, g), b && b());
            return c ? null : d
        }
        return null
    }

    function we(a, b, c) {
        Sa(I(a.na, b), function (a) {
            (a = a.j()) && R(a, function (a, b) {
                ae(b)
            })
        }, c, !0)
    }

    function W(a, b, c) {
        function d(a) {
            do {
                if (g[a.toString()])return!0;
                a = a.parent()
            } while (null !== a);
            return!1
        }

        var e = a.ec, f = a.g.$;
        a.ec = f;
        for (var g = {}, k = 0; k < c.length; k++)g[c[k].toString()] = !0;
        de(e, f, b, a.na, function (c, e, f) {
            if (b.contains(c)) {
                var g = d(c);
                g && we(a, c, !1);
                a.lc(c, e, f);
                g && we(a, c, !0)
            } else a.lc(c, e, f)
        });
        d(b) && we(a, b, !0);
        xe(a, b)
    }

    function xe(a, b) {
        var c = I(a.na, b);
        Sa(c, function (a) {
            (a = a.j()) && R(a, function (a, b) {
                b.Jb()
            })
        }, !0, !0);
        Ta(c, function (a) {
            (a = a.j()) && R(a, function (a, b) {
                b.Jb()
            })
        }, !1)
    }

    oe.prototype.lc = function (a, b, c) {
        a = I(this.na, a).j();
        null !== a && R(a, function (a, e) {
            e.lc(b, c)
        })
    };
    function ue(a) {
        return Ta(a, function (a) {
            return a.j() && ke(a.j())
        })
    }

    function qe(a, b, c, d, e) {
        if (ke(c) || ue(b))he(c, d, e); else {
            var f, g;
            c.f() || (f = c.toString(), g = c.hb());
            he(c, d, e);
            c.setActive(ye(a, c));
            f && g && xd(a.u, c.path(), f, g)
        }
        ke(c) && Sa(b, function (a) {
            if (a = a.j())a.xa && a.xa(), a.xa = null
        })
    }

    function ve(a, b) {
        function c(b) {
            var f = b.j();
            if (f && je(f))d.push(f.path()), null == f.xa && f.setActive(ye(a, f)); else {
                if (f) {
                    null != f.xa || f.setActive(ye(a, f));
                    var g = {};
                    R(f, function (a, b) {
                        b.i.A(function (a) {
                            A(g, a) || (g[a] = !0, a = f.path().child(a), d.push(a))
                        })
                    })
                }
                b.A(c)
            }
        }

        var d = [];
        c(b);
        return d
    }

    function ye(a, b) {
        if (a.u) {
            var c = a.u, d = b.path(), e = b.toString(), f = b.hb(), g, k = b.keys(), l = je(b);
            fb_listen(a.u, b, function (c) {
                "ok" !== c ? (c = fc(c), fb_warning("on() or once() for " + b.path().toString() + " failed: " + c.toString()), ze(a, b, c)) : g || (l ? we(a, b.path(), !0) : zb(k, function (a) {
                    (a = b.get(a)) && ae(a)
                }), xe(a, b.path()))
            });
            return function () {
                g = !0;
                xd(c, d, e, f)
            }
        }
        return ba
    }

    function ze(a, b, c) {
        b && (R(b, function (a, b) {
            for (var f = 0; f < b.pa.length; f++) {
                var g = b.pa[f];
                g.cancel && dc(g.cancel, g.Y)(c)
            }
        }), te(a, b))
    }

    function pe(a, b) {
        return"default" === a.queryIdentifier() ? new be(a, b) : new le(a, b)
    }

    oe.prototype.rb = function (a, b, c, d) {
        function e(a) {
            cc(a, function (a, b) {
                f[b] = 3 === a ? 3 : (fb_getProperty(f, b) || a) === a ? a : 3
            })
        }

        var f = {};
        R(b, function (b, f) {
            e(f.rb(a, c, d))
        });
        c.O() || c.A(function (a) {
            A(f, a) || (f[a] = 4)
        });
        return f
    };
    function Ae(a, b, c, d, e) {
        var f = b.path();
        b = a.rb(f, b, d, e);
        var g = kFBGlobalNode, k = [];
        cc(b, function (b, m) {
            var p = new FBPath(m);
            3 === b || 1 === b ? g = g.H(m, d.K(p)) : (2 === b && k.push({path: f.child(m), ra: kFBGlobalNode}), k = k.concat(Be(a, d.K(p), I(c, p), e)))
        });
        return[
            {path: f, ra: g}
        ].concat(k)
    }

    function Ce(a, b, c, d) {
        var e;
        a:{
            var f = I(a.na, b);
            e = f.parent();
            for (var g = []; null !== e;) {
                var k = e.j();
                if (null !== k) {
                    if (je(k)) {
                        e = [
                            {path: b, ra: c}
                        ];
                        break a
                    }
                    k = a.rb(b, k, c, d);
                    f = fb_getProperty(k, f.name());
                    if (3 === f || 1 === f) {
                        e = [
                            {path: b, ra: c}
                        ];
                        break a
                    }
                    2 === f && g.push({path: b, ra: kFBGlobalNode})
                }
                f = e;
                e = e.parent()
            }
            e = g
        }
        if (1 == e.length && (!e[0].ra.f() || c.f()))return e;
        g = I(a.na, b);
        f = g.j();
        null !== f ? je(f) ? e.push({path: b, ra: c}) : e = e.concat(Ae(a, f, g, c, d)) : e = e.concat(Be(a, c, g, d));
        return e
    }

    function Be(a, b, c, d) {
        var e = c.j();
        if (null !== e)return je(e) ? [
            {path: c.path(), ra: b}
        ] : Ae(a, e, c, b, d);
        var f = [];
        c.A(function (c) {
            var e = b.O() ? kFBGlobalNode : b.N(c.name());
            c = Be(a, e, c, d);
            f = f.concat(c)
        });
        return f
    };
    function FirebaseImp(a) {
        this._url = a;
        this._info = fb_create_info_slot(a);
        this.u = new FBDataConnection(this._url, r(this.hc, this), r(this.fc, this), r(this.Ab, this), r(this.Qc, this), r(this.Hc, this));
        this.Bd = Hc(a, r(function () {
            return new Dc(this._info, this.u)
        }, this));
        this.Ta = new FBTree;
        this.Fa = new Ld;
        this.g = new Md;
        this.I = new oe(this.u, this.g.oa);
        this.Jc = new Ld;
        this.Kc = new oe(null, this.Jc);
        Ee(this, "connected", !1);
        Ee(this, "authenticated", !1);
        this.S = new Hd;
        this.dataUpdateCount = 0
    }

    h = FirebaseImp.prototype;
    FirebaseImp.prototype.toString = function () {
        return(this._url.qc ? "https://" : "http://") + this._url.host
    };
    FirebaseImp.prototype.name = function () {
        return this._url.bc
    };
    function fb_get_servertime_offset(a) {
        a = S(a.Jc, new FBPath(".info/serverTimeOffset")).val() || 0;
        return(new Date).getTime() + a
    }

    function fb_get_timestamp(a) {
        a = {timestamp: fb_get_servertime_offset(a)};
        a.timestamp = a.timestamp || (new Date).getTime();
        return a
    }

    FirebaseImp.prototype.hc = function (a, b, c) {
        this.dataUpdateCount++;
        this.nd && (b = this.nd(a, b));
        var d, e, f = [];
        9 <= a.length && a.lastIndexOf(".priority") === a.length - 9 ? (d = new FBPath(a.substring(0, a.length - 9)), e = S(this.g.ta, d).copy(b), f.push(d)) : c ? (d = new FBPath(a), e = S(this.g.ta, d), cc(b, function (a, b) {
            var c = new FBPath(b);
            ".priority" === b ? e = e.copy(a) : (e = e.ya(c, O(a)), f.push(d.child(b)))
        })) : (d = new FBPath(a), e = O(b), f.push(d));
        a = Ce(this.I, d, e, this.g.L);
        b = !1;
        for (c = 0; c < a.length; ++c) {
            var g = a[c];
            b = Nd(this.g, g.path, g.ra) || b
        }
        b && (d = rerunTransactionsUnderNode_(this, d));
        W(this.I, d, f)
    };
    FirebaseImp.prototype.fc = function (a) {
        Ee(this, "connected", a);
        !1 === a && Ie(this)
    };
    FirebaseImp.prototype.Qc = function (a) {
        var b = this;
        bc(a, function (a, d) {
            Ee(b, d, a)
        })
    };
    FirebaseImp.prototype.Hc = function (a) {
        a = new FBPath(a);
        return S(this.g.ta, a).hash()
    };
    FirebaseImp.prototype.Ab = function (a) {
        Ee(this, "authenticated", a)
    };
    function Ee(a, b, c) {
        b = new FBPath("/.info/" + b);
        T(a.Jc, b, O(c));
        W(a.Kc, b, [b])
    }

    FirebaseImp.prototype.auth = function (a, b, c) {
        "firebaseio-demo.com" === this._url.domain && fb_warning("FirebaseRef.auth() not supported on demo (*.firebaseio-demo.com) Firebases. Please use on production (*.firebaseio.com) Firebases only.");
        this.u.auth(a, function (a, c) {
            X(b, a, c)
        }, function (a, b) {
            fb_warning("auth() was canceled: " + b);
            if (c) {
                var f = Error(b);
                f.code = a.toUpperCase();
                c(f)
            }
        })
    };
    FirebaseImp.prototype.unauth = function (a) {
        this.u.unauth(function (b, c) {
            X(a, b, c)
        })
    };
    FirebaseImp.prototype.setWithPriority = function (a, b, c, d) {
        this._logger("set", {path: a.toString(), value: b, ja: c});
        var e = fb_get_timestamp(this);
        b = O(b, c);
        var e = Td(b, e), e = Ce(this.I, a, e, this.g.L), f = this.g.set(a, e), g = this;
        this.u.put(a.toString(), b.val(!0), function (b, c) {
            "ok" !== b && fb_warning("set at " + a + " failed: " + b);
            Qd(g.g, f);
            Od(g.g, a);
            var e = rerunTransactionsUnderNode_(g, a);
            W(g.I, e, []);
            X(d, b, c)
        });
        e = Je(this, a);
        rerunTransactionsUnderNode_(this, e);
        W(this.I, e, [a])
    };
    FirebaseImp.prototype.update = function (a, b, c) {
        this._logger("update", {path: a.toString(), value: b});
        var d = S(this.g.oa, a), e = !0, f = [], g = fb_get_timestamp(this), k = [], l;
        for (l in b) {
            var e = !1, m = O(b[l]), m = Td(m, g), d = d.H(l, m), p = a.child(l);
            f.push(p);
            m = Ce(this.I, p, m, this.g.L);
            k = k.concat(this.g.set(a, m))
        }
        if (e)K("update() called with empty data.  Don't do anything."), X(c, "ok"); else {
            var t = this;
            Dd(this.u, a.toString(), b, function (b, d) {
                "ok" !== b && fb_warning("update at " + a + " failed: " + b);
                Qd(t.g, k);
                Od(t.g, a);
                var e = rerunTransactionsUnderNode_(t, a);
                W(t.I, e, []);
                X(c, b, d)
            });
            b = Je(this, a);
            rerunTransactionsUnderNode_(this, b);
            W(t.I,
                b, f)
        }
    };
    FirebaseImp.prototype.setPriority = function (a, b, c) {
        this._logger("setPriority", {path: a.toString(), ja: b});
        var d = fb_get_timestamp(this), d = Rd(b, d), d = S(this.g.L, a).copy(d), d = Ce(this.I, a, d, this.g.L), e = this.g.set(a, d), f = this;
        this.u.put(a.toString() + "/.priority", b, function (b, d) {
            "permission_denied" === b && fb_warning("setPriority at " + a + " failed: " + b);
            Qd(f.g, e);
            Od(f.g, a);
            var l = rerunTransactionsUnderNode_(f, a);
            W(f.I, l, []);
            X(c, b, d)
        });
        b = rerunTransactionsUnderNode_(this, a);
        W(f.I, b, [])
    };
    function Ie(a) {
        a._logger("onDisconnectEvents");
        var b = [], c = fb_get_timestamp(a);
        Kd(Sd(a.S, c), new FBPath(""), function (c, e) {
            var f = Ce(a.I, c, e, a.g.L);
            b.push.apply(b, a.g.set(c, f));
            f = Je(a, c);
            rerunTransactionsUnderNode_(a, f);
            W(a.I, f, [c])
        });
        Qd(a.g, b);
        a.S = new Hd
    }

    FirebaseImp.prototype.Nc = function (a, b) {
        var c = this;
        this.u.Nc(a.toString(), function (d, e) {
            "ok" === d && Jd(c.S, a);
            X(b, d, e)
        })
    };
    function Ke(a, b, c, d) {
        var e = O(c);
        zd(a.u, b.toString(), e.val(!0), function (c, g) {
            "ok" === c && Id(a.S, b, e);
            X(d, c, g)
        })
    }

    function Le(a, b, c, d, e) {
        var f = O(c, d);
        zd(a.u, b.toString(), f.val(!0), function (c, d) {
            "ok" === c && Id(a.S, b, f);
            X(e, c, d)
        })
    }

    function Me(a, b, c, d) {
        var e = !0, f;
        for (f in c)e = !1;
        e ? (K("onDisconnect().update() called with empty data.  Don't do anything."), X(d, "ok")) : Bd(a.u, b.toString(), c, function (e, f) {
            if ("ok" === e)for (var l in c) {
                var m = O(c[l]);
                Id(a.S, b.child(l), m)
            }
            X(d, e, f)
        })
    }

    function Ne(a) {
        fb_save_info_slot(a._info, "deprecated_on_disconnect");
        a.Bd.Zc.deprecated_on_disconnect = !0
    }

    FirebaseImp.prototype.Sb = function (a, b, c, d, e) {
        ".info" === fb_safe_get_subpath(a.path) ? this.Kc.Sb(a, b, c, d, e) : this.I.Sb(a, b, c, d, e)
    };
    FirebaseImp.prototype.oc = function (a, b, c, d) {
        if (".info" === fb_safe_get_subpath(a.path))this.Kc.oc(a, b, c, d); else {
            b = this.I.oc(a, b, c, d);
            if (c = null !== b) {
                c = this.g;
                d = a.path;
                for (var e = [], f = 0; f < b.length; ++f)e[f] = S(c.ta, b[f]);
                T(c.ta, d, kFBGlobalNode);
                for (f = 0; f < b.length; ++f)T(c.ta, b[f], e[f]);
                c = Od(c, d)
            }
            c && (fb_assert(this.g.oa.$ === this.I.ec, "We should have raised any outstanding events by now.  Else, we'll blow them away."), T(this.g.oa, a.path, S(this.g.L, a.path)), this.I.ec = this.g.oa.$)
        }
    };
    FirebaseImp.prototype.interrupt = function () {
        this.u.interrupt()
    };
    FirebaseImp.prototype.resume = function () {
        this.u.resume()
    };
    FirebaseImp.prototype.stats = function (a) {
        if ("undefined" !== typeof console) {
            a ? (this.tc || (this.tc = new Cc(this._info)), a = this.tc.get()) : a = this._info.get();
            var b = Bb(yc(a), function (a, b) {
                return Math.max(b.length, a)
            }, 0), c;
            for (c in a) {
                for (var d = a[c], e = c.length; e < b + 2; e++)c += " ";
                console.log(c + d)
            }
        }
    };
    FirebaseImp.prototype.statsIncrementCounter = function (a) {
        fb_save_info_slot(this._info, a);
        this.Bd.Zc[a] = !0
    };
    FirebaseImp.prototype._logger = function () {
        K("r:" + this.u.id + ":", arguments)
    };
    function X(a, b, c) {
        a && fb_safe_exec(function () {
            if ("ok" == b)a(null, c); else {
                var d = (b || "error").toUpperCase(), e = d;
                c && (e += ": " + c);
                e = Error(e);
                e.code = d;
                a(e)
            }
        })
    };
    function Oe(a, b, c, d, e) {
        function f() {
        }

        a._logger("transaction on " + b);
        var g = new Firebase(a, b);
        g.on("value", f);
        c = {path: b, update: c, D: d, status: null, rd: Ob(), yc: e, wd: 0, vc: function () {
            g.off("value", f)
        }, wc: null};
        a.Fa.$ = Pe(a, a.Fa.$, a.g.L.$, a.Ta);
        d = c.update(S(a.Fa, b).val());
        if (isDefined(d)) {
            Ba("transaction failed: Data returned ", d);
            c.status = 1;
            e = I(a.Ta, b);
            var k = e.j() || [];
            k.push(c);
            J(e, k);
            k = "object" === typeof d && null !== d && A(d, ".priority") ? d[".priority"] : S(a.g.L, b).getPriority();
            e = fb_get_timestamp(a);
            d = O(d, k);
            d = Td(d, e);
            T(a.Fa, b, d);
            c.yc && (T(a.g.oa, b, d), W(a.I,
                b, [b]));
            Qe(a)
        } else c.vc(), c.D && (a = Re(a, b), c.D(null, !1, a))
    }

    function Qe(a, b) {
        var c = b || a.Ta;
        b || Se(a, c);
        if (null !== c.j()) {
            var d = Te(a, c);
            fb_assert(0 < d.length);
            Cb(d, function (a) {
                return 1 === a.status
            }) && Ue(a, c.path(), d)
        } else c.hasChildren() && c.A(function (b) {
            Qe(a, b)
        })
    }

    function Ue(a, b, c) {
        for (var d = 0; d < c.length; d++)fb_assert(1 === c[d].status, "tryToSendTransactionQueue_: items in queue should all be run."), c[d].status = 2, c[d].wd++;
        var e = S(a.g.L, b).hash();
        T(a.g.L, b, S(a.g.oa, b));
        for (var f = S(a.Fa, b).val(!0), g = Ob(), k = Ve(c), d = 0; d < k.length; d++)J(I(a.g.Gb, k[d]), g);
        a.u.put(b.toString(), f, function (e) {
            a._logger("transaction put response", {path: b.toString(), status: e});
            for (d = 0; d < k.length; d++) {
                var f = I(a.g.Gb, k[d]), p = f.j();
                fb_assert(null !== p, "sendTransactionQueue_: pendingPut should not be null.");
                p ===
                    g && (J(f, null), T(a.g.L, k[d], S(a.g.ta, k[d])))
            }
            if ("ok" === e) {
                e = [];
                for (d = 0; d < c.length; d++)c[d].status = 3, c[d].D && (f = Re(a, c[d].path), e.push(r(c[d].D, null, null, !0, f))), c[d].vc();
                Se(a, I(a.Ta, b));
                Qe(a);
                for (d = 0; d < e.length; d++)fb_safe_exec(e[d])
            } else {
                if ("datastale" === e)for (d = 0; d < c.length; d++)c[d].status = 4 === c[d].status ? 5 : 1; else for (fb_warning("transaction at " + b + " failed: " + e), d = 0; d < c.length; d++)c[d].status = 5, c[d].wc = e;
                e = rerunTransactionsUnderNode_(a, b);
                W(a.I, e, [b])
            }
        }, e)
    }

    function Ve(a) {
        for (var b = {}, c = 0; c < a.length; c++)a[c].yc && (b[a[c].path.toString()] = a[c].path);
        a = [];
        for (var d in b)a.push(b[d]);
        return a
    }

    function rerunTransactionsUnderNode_(a, b) {
        var c = We(a, b), d = c.path(), c = Te(a, c);
        T(a.g.oa, d, S(a.g.L, d));
        T(a.Fa, d, S(a.g.L, d));
        if (0 !== c.length) {
            for (var e = S(a.g.oa, d), f = e, g = [], k = 0; k < c.length; k++) {
                var l = Oa(d, c[k].path), m = !1, p;
                fb_assert(null !== l, "rerunTransactionsUnderNode_: relativePath should not be null.");
                if (5 === c[k].status)m = !0, p = c[k].wc; else if (1 === c[k].status)if (25 <= c[k].wd)m = !0, p = "maxretry"; else {
                    var t = e.K(l), s = c[k].update(t.val());
                    if (isDefined(s)) {
                        Ba("transaction failed: Data returned ", s);
                        var w = O(s);
                        "object" === typeof s && null != s && A(s, ".priority") ||
                        (w = w.copy(t.getPriority()));
                        e = e.ya(l, w);
                        c[k].yc && (f = f.ya(l, w))
                    } else m = !0, p = "nodata"
                }
                m && (c[k].status = 3, setTimeout(c[k].vc, 0), c[k].D && (m = new Firebase(a, c[k].path), l = new FBDataSnapshot(e.K(l), m), "nodata" === p ? g.push(r(c[k].D, null, null, !1, l)) : g.push(r(c[k].D, null, Error(p), !1, l))))
            }
            T(a.Fa, d, e);
            T(a.g.oa, d, f);
            Se(a, a.Ta);
            for (k = 0; k < g.length; k++)fb_safe_exec(g[k]);
            Qe(a)
        }
        return d
    }

    function We(a, b) {
        for (var c, d = a.Ta; null !== (c = fb_safe_get_subpath(b)) && null === d.j();)d = I(d, c), b = fb_next_level_path(b);
        return d
    }

    function Te(a, b) {
        var c = [];
        Xe(a, b, c);
        c.sort(function (a, b) {
            return a.rd - b.rd
        });
        return c
    }

    function Xe(a, b, c) {
        var d = b.j();
        if (null !== d)for (var e = 0; e < d.length; e++)c.push(d[e]);
        b.A(function (b) {
            Xe(a, b, c)
        })
    }

    function Se(a, b) {
        var c = b.j();
        if (c) {
            for (var d = 0, e = 0; e < c.length; e++)3 !== c[e].status && (c[d] = c[e], d++);
            c.length = d;
            J(b, 0 < c.length ? c : null)
        }
        b.A(function (b) {
            Se(a, b)
        })
    }

    function Je(a, b) {
        var c = We(a, b).path(), d = I(a.Ta, b);
        Ta(d, function (a) {
            Ye(a)
        });
        Ye(d);
        Sa(d, function (a) {
            Ye(a)
        });
        return c
    }

    function Ye(a) {
        var b = a.j();
        if (null !== b) {
            for (var c = [], d = -1, e = 0; e < b.length; e++)4 !== b[e].status && (2 === b[e].status ? (fb_assert(d === e - 1, "All SENT items should be at beginning of queue."), d = e, b[e].status = 4, b[e].wc = "set") : (fb_assert(1 === b[e].status), b[e].vc(), b[e].D && c.push(r(b[e].D, null, Error("set"), !1, null))));
            -1 === d ? J(a, null) : b.length = d + 1;
            for (e = 0; e < c.length; e++)fb_safe_exec(c[e])
        }
    }

    function Re(a, b) {
        var c = new Firebase(a, b);
        return new FBDataSnapshot(S(a.Fa, b), c)
    }

    function Pe(a, b, c, d) {
        if (d.f())return c;
        if (null != d.j())return b;
        var e = c;
        d.A(function (d) {
            var g = d.name(), k = new FBPath(g);
            d = Pe(a, b.K(k), c.K(k), d);
            e = e.H(g, d)
        });
        return e
    };
    function FBContext() {
        this.ib = {}
    }

    FBSingleton(FBContext);
    FBContext.prototype.interrupt = function () {
        for (var a in this.ib)this.ib[a].interrupt()
    };

    FBContext.prototype.resume = function () {
        for (var a in this.ib)this.ib[a].resume()
    };

    var FirebaseInternal = {hijackHash: function (a) {
        var b = FBNode.prototype.hash;
        FBNode.prototype.hash = a;
        var c = FBLeafNode.prototype.hash;
        FBLeafNode.prototype.hash = a;
        return function () {
            FBNode.prototype.hash = b;
            FBLeafNode.prototype.hash = c
        }
    }};

    FirebaseInternal.queryIdentifier = function (a) {
        return a.queryIdentifier()
    };

    FirebaseInternal.listens = function (a) {
        return a.m.u.ha
    };

    FirebaseInternal.refConnection = function (a) {
        return a.m.u.ka
    };

    FirebaseInternal.DataConnection = FBDataConnection;

    FBDataConnection.prototype.sendRequest = FBDataConnection.prototype.sendRequest_;

    FirebaseInternal.RealTimeConnection = RealTimeConnection;

    RealTimeConnection.prototype.sendRequest = RealTimeConnection.prototype.yd;

    FirebaseInternal.ConnectionTarget = ConnectionTarget;

    FirebaseInternal.forceLongPolling = function () {
        Rc = Jc = true
    };

    FirebaseInternal.forceWebSockets = function () {
        kFBForeceWebSocket = true
    };

    FirebaseInternal.setSecurityDebugCallback = function (a, b) {
        a.m.u.Vc = b
    };

    FirebaseInternal.stats = function (a, b) {
        a.m.stats(b)
    };

    FirebaseInternal.statsIncrementCounter = function (a, b) {
        a.m.statsIncrementCounter(b)
    };

    FirebaseInternal.dataUpdateCount = function (a) {
        return a.m.dataUpdateCount
    };

    FirebaseInternal.interceptServerData = function (a, b) {
        a.m.nd = b
    };

    function $(a, b, c) {
        this.Kb = a;
        this.X = b;
        this._name = c
    }

    $.prototype.cancel = function (a) {
        fb_check_args("Firebase.onDisconnect().cancel", 0, 1, arguments.length);
        isValidFunction("Firebase.onDisconnect().cancel", 1, a, !0);
        this.Kb.Nc(this.X, a)
    };

    $.prototype.remove = function (a) {
        fb_check_args("Firebase.onDisconnect().remove", 0, 1, arguments.length);
        fb_check_modify_info("Firebase.onDisconnect().remove", this.X);
        isValidFunction("Firebase.onDisconnect().remove", 1, a, !0);
        Ke(this.Kb, this.X, null, a)
    };

    $.prototype.set = function (a, b) {
        fb_check_args("Firebase.onDisconnect().set", 1, 2, arguments.length);
        fb_check_modify_info("Firebase.onDisconnect().set", this.X);
        Aa("Firebase.onDisconnect().set", a, !1);
        isValidFunction("Firebase.onDisconnect().set", 2, b, !0);
        Ke(this.Kb, this.X, a, b)
    };

    $.prototype.setWithPriority = function (a, b, c) {
        fb_check_args("Firebase.onDisconnect().setWithPriority", 2, 3, arguments.length);
        fb_check_modify_info("Firebase.onDisconnect().setWithPriority", this.X);
        Aa("Firebase.onDisconnect().setWithPriority", a, !1);
        fb_check_priority("Firebase.onDisconnect().setWithPriority", 2, b, !1);
        isValidFunction("Firebase.onDisconnect().setWithPriority", 3, c, !0);
        if (".length" === this._name || ".keys" === this._name)throw"Firebase.onDisconnect().setWithPriority failed: " + this._name + " is a read-only object.";
        Le(this.Kb, this.X, a, b, c)
    };

    $.prototype.update = function (a, b) {
        fb_check_args("Firebase.onDisconnect().update", 1, 2, arguments.length);
        fb_check_modify_info("Firebase.onDisconnect().update", this.X);
        if (isArray(a)) {
            for (var c = {}, d = 0; d < a.length; ++d)c["" + d] = a[d];
            a = c;
            fb_warning("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")
        }
        fb_check_object("Firebase.onDisconnect().update", a);
        isValidFunction("Firebase.onDisconnect().update", 2, b, !0);
        Me(this.Kb,
            this.X, a, b)
    };

    var fb_encode_timestamp = function () {
        var a = 0, b = [];
        return function (c) {
            var d = c === a;
            a = c;
            for (var e = Array(8), f = 7; 0 <= f; f--)e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64), c = Math.floor(c / 64);
            fb_assert(0 === c, "Cannot push at time == 0");
            c = e.join("");
            if (d) {
                for (f = 11; 0 <= f && 63 === b[f]; f--)b[f] = 0;
                b[f]++
            } else for (f = 0; 12 > f; f++)b[f] = Math.floor(64 * Math.random());
            for (f = 0; 12 > f; f++)c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
            fb_assert(20 === c.length, "NextPushId: Length should be 20.");
            return c
        }
    }();

    function Firebase(a, b) {
        var c, d;
        if (a instanceof FirebaseImp) {
            c = a, d = b;
        }else {
            fb_check_args("new Firebase", 1, 2, arguments.length);
            var e = arguments[0];
            d = c = "";
            var f = !0, g = "";
            if (isString(e)) {
                var k = e.indexOf("//");
                if (0 <= k)var l = e.substring(0, k - 1), e = e.substring(k + 2);
                k = e.indexOf("/");
                -1 === k && (k = e.length);
                c = e.substring(0, k);
                var e = e.substring(k + 1), m = c.split(".");
                if (3 == m.length) {
                    k = m[2].indexOf(":");
                    f = 0 <= k ? "https" === l || "wss" === l : !0;
                    if ("firebase" === m[1])fb_throw(c + " is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"); else for (d = m[0],
                                                                                                                                                g = "", e = ("/" + e).split("/"), k = 0; k < e.length; k++)if (0 < e[k].length) {
                        m = e[k];
                        try {
                            m = decodeURIComponent(m.replace(/\+/g, " "))
                        } catch (p) {
                        }
                        g += "/" + m
                    }
                    d = d.toLowerCase()
                } else fb_throw("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com")
            }
            f || "undefined" !== typeof window && window.location && window.location.protocol && -1 !== window.location.protocol.indexOf("https:") && fb_warning("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");
            c = new ConnectionTarget(c, f, d, "ws" === l || "wss" === l);
            d = new FBPath(g);
            f = d.toString();
            !(l = !isString(c.host) || 0 === c.host.length || !isValidString(c.bc)) && (l = 0 !== f.length) && (f && (f = f.replace(/^\/*\.info(\/|$)/, "/")), l = !(isString(f) && 0 !== f.length && !ya.test(f)));
            if (l)throw Error(errorPrefix_("new Firebase", 1, !1) + 'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');
            if (b)if (b instanceof FBContext)f = b; else throw Error("Expected a valid Firebase.Context for second argument to new Firebase()"); else f = FBContext.sharedInstance();
            l = c.toString();
            e = fb_getProperty(f.ib, l);
            e || (e = new FirebaseImp(c), f.ib[l] = e);
            c = e
        }

        FirebaseObject.call(this, c, d)
    }

    ka(Firebase, FirebaseObject);
    aa.Firebase = Firebase;

    Firebase.prototype.name = function () {
        fb_check_args("Firebase.name", 0, 0, arguments.length);
        return this.path.f() ? null : Na(this.path)
    };

    Firebase.prototype.child = function (a) {
        fb_check_args("Firebase.child", 1, 1, arguments.length);
        if (isNumber(a))a = String(a); else if (!(a instanceof FBPath))if (null === fb_safe_get_subpath(this.path)) {
            var b = a;
            b && (b = b.replace(/^\/*\.info(\/|$)/, "/"));
            fb_check_path("Firebase.child", b)
        } else fb_check_path("Firebase.child", a);
        return new Firebase(this.m, this.path.child(a))
    };

    Firebase.prototype.parent = function () {
        fb_check_args("Firebase.parent", 0, 0, arguments.length);
        var a = this.path.parent();
        return null === a ? null : new Firebase(this.m, a)
    };

    Firebase.prototype.root = function () {
        fb_check_args("Firebase.ref", 0, 0, arguments.length);
        for (var a = this; null !== a.parent();)a = a.parent();
        return a
    };

    Firebase.prototype.toString = function () {
        fb_check_args("Firebase.toString", 0, 0, arguments.length);
        var a;
        if (null === this.parent())a = this.m.toString(); else {
            a = this.parent().toString() + "/";
            var b = this.name();
            a += encodeURIComponent(String(b))
        }
        return a
    };

    Firebase.prototype.set = function (a, b) {
        fb_check_args("Firebase.set", 1, 2, arguments.length);
        fb_check_modify_info("Firebase.set", this.path);
        Aa("Firebase.set", a, !1);
        isValidFunction("Firebase.set", 2, b, !0);
        this.m.setWithPriority(this.path, a, null, b)
    };

    Firebase.prototype.update = function (a, b) {
        fb_check_args("Firebase.update", 1, 2, arguments.length);
        fb_check_modify_info("Firebase.update", this.path);
        if (isArray(a)) {
            for (var c = {}, d = 0; d < a.length; ++d)c["" + d] = a[d];
            a = c;
            fb_warning("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")
        }
        fb_check_object("Firebase.update", a);
        isValidFunction("Firebase.update", 2, b, !0);
        if (A(a, ".priority"))throw Error("update() does not currently support updating .priority.");
        this.m.update(this.path, a, b)
    };

    Firebase.prototype.setWithPriority = function (a, b, c) {
        fb_check_args("Firebase.setWithPriority", 2, 3, arguments.length);
        fb_check_modify_info("Firebase.setWithPriority", this.path);
        Aa("Firebase.setWithPriority", a, !1);
        fb_check_priority("Firebase.setWithPriority", 2, b, !1);
        isValidFunction("Firebase.setWithPriority", 3, c, !0);
        if (".length" === this.name() || ".keys" === this.name())throw"Firebase.setWithPriority failed: " + this.name() + " is a read-only object.";
        this.m.setWithPriority(this.path, a, b, c)
    };

    Firebase.prototype.remove = function (a) {
        fb_check_args("Firebase.remove", 0, 1, arguments.length);
        fb_check_modify_info("Firebase.remove", this.path);
        isValidFunction("Firebase.remove", 1, a, !0);
        this.set(null, a)
    };

    Firebase.prototype.transaction = function (a, b, c) {
        fb_check_args("Firebase.transaction", 1, 3, arguments.length);
        fb_check_modify_info("Firebase.transaction", this.path);
        isValidFunction("Firebase.transaction", 1, a, !1);
        isValidFunction("Firebase.transaction", 2, b, !0);
        if (isDefined(c) && "boolean" != typeof c)throw Error(errorPrefix_("Firebase.transaction", 3, !0) + "must be a boolean.");
        if (".length" === this.name() || ".keys" === this.name())throw"Firebase.transaction failed: " + this.name() + " is a read-only object.";
        "undefined" === typeof c && (c = !0);
        Oe(this.m, this.path, a, b, c)
    };

    Firebase.prototype.setPriority = function (a, b) {
        fb_check_args("Firebase.setPriority", 1, 2, arguments.length);
        fb_check_modify_info("Firebase.setPriority", this.path);
        fb_check_priority("Firebase.setPriority", 1, a, !1);
        isValidFunction("Firebase.setPriority", 2, b, !0);
        this.m.setPriority(this.path, a, b)
    };

    Firebase.prototype.push = function (a, b) {
        fb_check_args("Firebase.push", 0, 2, arguments.length);
        fb_check_modify_info("Firebase.push", this.path);
        Aa("Firebase.push", a, !0);
        isValidFunction("Firebase.push", 2, b, !0);
        var c = fb_get_servertime_offset(this.m);
        console.log(c);
        c = fb_encode_timestamp(c);
        console.log(c);
        c = this.child(c);
        "undefined" !== typeof a && null !== a && c.set(a, b);
        return c
    };

    Firebase.prototype.onDisconnect = function () {
        return new $(this.m, this.path, this.name())
    };

    Firebase.prototype.removeOnDisconnect = function () {
        fb_warning("FirebaseRef.removeOnDisconnect() being deprecated. Please use FirebaseRef.onDisconnect().remove() instead.");
        this.onDisconnect().remove();
        Ne(this.m)
    };

    Firebase.prototype.setOnDisconnect = function (a) {
        fb_warning("FirebaseRef.setOnDisconnect(value) being deprecated. Please use FirebaseRef.onDisconnect().set(value) instead.");
        this.onDisconnect().set(a);
        Ne(this.m)
    };

    Firebase.prototype.auth = function (a, b, c) {
        fb_check_args("Firebase.auth", 1, 3, arguments.length);
        if (!isString(a))throw Error(errorPrefix_("Firebase.auth", 1, !1) + "must be a valid credential (a string).");
        isValidFunction("Firebase.auth", 2, b, !0);
        isValidFunction("Firebase.auth", 3, b, !0);
        this.m.auth(a, b, c)
    };

    Firebase.prototype.unauth = function (a) {
        fb_check_args("Firebase.unauth", 0, 1, arguments.length);
        isValidFunction("Firebase.unauth", 1, a, !0);
        this.m.unauth(a)
    };

    Firebase.goOffline = function () {
        fb_check_args("Firebase.goOffline", 0, 0, arguments.length);
        FBContext.sharedInstance().interrupt()
    };
    Firebase.goOnline = function () {
        fb_check_args("Firebase.goOnline", 0, 0, arguments.length);
        FBContext.sharedInstance().resume()
    };
    function fb_is_log_enabled(a, b) {
        fb_assert(!b || !0 === a || !1 === a, "Can't turn on custom loggers persistently.");
        !0 === a ? ("undefined" !== typeof console && ("function" === typeof console.log ? Qb = r(console.log, console) : "object" === typeof console.log && (Qb = function (a) {
            console.log(a)
        })), b && FBSessionStorage.set("logging_enabled", true)) : a ? Qb = a : (Qb = null, FBSessionStorage.remove("logging_enabled"))
    }

    Firebase.enableLogging = fb_is_log_enabled;
    Firebase.ServerValue = {TIMESTAMP: {".sv": "timestamp"}};
    Firebase.SDK_VERSION = "1.0.21";
    Firebase.INTERNAL = FirebaseInternal;
    Firebase.Context = FBContext;
})();

//(function(){
//    // CREATE A REFERENCE TO FIREBASE
//    var messagesRef = new Firebase('https://oznachak0jk.firebaseio-demo.com/');
//
//    // Add a callback that is triggered for each chat message.
//    messagesRef.limit(10).on('child_added', function (snapshot) {
//        //GET DATA
//        var data = snapshot.val();
//        console.log(data);
//    });
//})();
