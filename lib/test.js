(function() {

    var tree = new TMRLevelTree();
    var url = "http://jewery.info/demo/a";
    var idx = url.indexOf('://');
    var protocol = null;

    if (idx != -1) {
        var endIdx = idx + '://'.length;
        protocol = url.substr(0, endIdx);
        url = url.substr(endIdx);
    }else{

    }

    var components = url.split('/');
    var domain = null;
    var rootTree = tree;
    if (components.length > 0) {
        domain = components[0];
        for (var i = 1; i < components.length; ++i) {
            var tLooper = new TMRLevelTree();
            tree.insertData(components[i], tLooper);
            tree = tLooper;
        }
    }

    console.log(protocol, rootTree, domain);

})();