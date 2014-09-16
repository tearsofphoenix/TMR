(function() {

    var tree = new TMRLevelTree();

    tree.insert({d: 'a'});
    tree.insert({d: 'b'});
    tree.insert({d: 'hall'});
    tree.insert({d: 'parse'});

    var itr = tree.findIter({d: 'hall'});
//    console.log(itr);

    var newTree = tree.insertNewLevelUnderChild('a');

    newTree.insert({d: 'c'});
//    console.log(tree, newTree);

    var node = tree.findNodeByPaths(['a', 'c']);
    console.log(node);
})();