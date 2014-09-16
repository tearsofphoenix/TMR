(function() {

    var tree = new TMRTree('a', function(a, b){
        return a > b ? 1 : (a == b ? 0 : - 1);
    });

    tree.insert('b');
    tree.insert('hall');
    tree.insert('parse');

    console.log(tree);
    var itr = tree.findIter('hall');
    console.log(itr);
})();