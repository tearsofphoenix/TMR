function StorageService(a) {
	try {
		if ("undefined" !== typeof window && "undefined" !== typeof window[a]) {
			var b = window[a];
			b.setItem("firebase:sentinel", "cache");
			b.removeItem("firebase:sentinel");
			return new kb(b)
		}
	} catch (c) {}
	return new lb
}

var LocalStorageService = StorageService("localStorage"),
	ob = StorageService("sessionStorage");

function URL(host, useSSL, c, d) {
	this.host = host.toLowerCase();
	this.domain = this.host.substr(this.host.indexOf(".") + 1);
	this.qc = useSSL;
	this.bc = c;
	this.ie = d;
	this.ga = LocalStorageService.get("host:" + host) || this.host
}

function qb(a, b) {
	b !== a.ga && (a.ga = b, "s-" === a.ga.substr(0, 2) && nb.set("host:" + a.host, a.ga))
}

URL.prototype.toString = function() {
	return (this.qc ? "https://" : "http://") + this.host
};