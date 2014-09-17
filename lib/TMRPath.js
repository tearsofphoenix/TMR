function TMRPath(a, level) {
    if (1 == arguments.length) {

        this._subpaths = a.split("/");

        for (var c = 0, d = 0; d < this._subpaths.length; d++){
            0 < this._subpaths[d].length && (this._subpaths[c] = this._subpaths[d], c++);
        }
        
        this._subpaths.length = c;
        this._level = 0
    } else{
        this._subpaths = a;
        this._level = level
    }
}

TMRPath.prototype.currentPath = function() {
    var a = this;
    return a._level >= a._subpaths.length ? null : a._subpaths[a._level]
};

TMRPath.prototype.nextLevelPath = function() {
    var b = this._level;
    b < this._subpaths.length && b++;
    return new TMRPath(this._subpaths, b)
};

TMRPath.prototype.toString = function () {
    for (var a = "", b = this._level; b < this._subpaths.length; b++)"" !== this._subpaths[b] && (a += "/" + this._subpaths[b]);
    return a || "/"
};
TMRPath.prototype.parent = function () {
    if (this._level >= this._subpaths.length)return null;
    for (var a = [], b = this._level; b < this._subpaths.length - 1; b++)a.push(this._subpaths[b]);
    return new TMRPath(a, 0)
};
TMRPath.prototype.child = function (a) {
    for (var b = [], c = this._level; c < this._subpaths.length; c++)b.push(this._subpaths[c]);
    if (a instanceof TMRPath)for (c = a._level; c < a._subpaths.length; c++)b.push(a._subpaths[c]); else for (a = a.split("/"), c = 0; c < a.length; c++)0 < a[c].length && b.push(a[c]);
    return new TMRPath(b, 0)
};
TMRPath.prototype.f = function () {
    return this._level >= this._subpaths.length
};
TMRPath.prototype.length = function () {
    return this._subpaths.length - this._level
};

function Oa(a, b) {
    var c = a.currentPath();
    if (null === c)return b;
    if (c === b.currentPath())return Oa(a.nextLevelPath(), b.nextLevelPath());
    throw"INTERNAL ERROR: innerPath (" + b + ") is not within outerPath (" + a + ")";
}

TMRPath.prototype.contains = function (a) {
    var b = this._level, c = a._level;
    if (this.length() > a.length())return!1;
    for (; b < this._subpaths.length;) {
        if (this._subpaths[b] !== a._subpaths[c])return!1;
        ++b;
        ++c
    }
    return!0
};