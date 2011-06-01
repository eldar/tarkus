define([
    "dojo",
    "ide/core/MainArea",
    "ide/project/Model",
    "dijit/Tree"
], function(dojo, mainArea, model, Tree) {

    var data = {
        label: "rootElem",
        id: "root-elem",
        children:
        [/*{
            label: 'Something',
            id: '1',
            children: [{
                label: 'Life',
                id: '1.1',
            },
            {
                label: 'Liberty',
                id: '1.2'
            }]
        },
        {
            label: 'Some links',
            id: '2',
            children: [{
                label: 'Life',
                id: '2.1'
            },
            {
                label: 'Liberty',
                id: '2.2'
            }]
        },*/
        {
            label: 'Childless',
            id: '3',
            children: []
        }]
    };

    var MyModel = dojo.declare(null, {
        root: data,
        
        getRoot: function(onItem, onError){
            onItem(this.root);
        },
        
        mayHaveChildren: function(item){
            return item.children;
        },
        
        getChildren: function(parentItem, callback, onError){
            callback(parentItem.children);
        },
        
        getLabel: function(item){
            return item.label;
        },
                
        isItem: function(something){
            var elem = something.id;
            return elem != null;
        },
        
        getIdentity: function(item){
            return item.id;
        }
        
    });

    var treeModel = new MyModel();
    
    var MyTree = dojo.declare(Tree, {
    });
    
    new MyTree({
        model: treeModel,
        autoExpand: false
    }).placeAt(mainArea.left.domNode);
});

/*
    var rawdata =
    [{
        label: 'Something',
        id: '1',
        children: [{
            label: 'Life',
            id: '1.1'
        },
        {
            label: 'Liberty',
            id: '1.2'
        }]
    },
    {
        label: 'Some links',
        id: '2',
        children: [{
            label: 'Life',
            id: '2.1'
        },
        {
            label: 'Liberty',
            id: '2.2'
        }]
    },
    {
        label: 'Childless',
        id: '3'
    }];

    var store = new dojo.data.ItemFileWriteStore({
        data: {
            identifier: 'id',
            label: 'label',
            items: rawdata
        }
    });
    store.fetchItemByIdentity({identity: '3', onItem: function(item) {
        store.newItem({label: 'New Item', id: '3.1'}, {parent: item, attribute:'children'});
    }})
    
    var treeModel = new dijit.tree.ForestStoreModel({
        store: store
    });
    
    new dijit.Tree({
        model: treeModel,
        showRoot: false,
    }).placeAt(mainArea.left.domNode);
*/

/*
    var data =
    {
    identifier: 'id',
    label: 'name',
    items: [
        { id: 'AS', name:'Asia', type:'continent',
          children:[{_reference:'CN'}, {_reference:'IN'}, {_reference:'RU'}, {_reference:'MN'}] },
        { id: 'CN', name:'China', type:'country' },
        { id: 'IN', name:'India', type:'country' },
        { id: 'RU', name:'Russia', type:'country' },
        { id: 'MN', name:'Mongolia', type:'country' },
        { id: 'EU', name:'Europe', type:'continent',
          children:[{_reference:'DE'}, {_reference:'FR'}, {_reference:'ES'}, {_reference:'IT'}] },
        { id: 'DE', name:'Germany', type:'country' },
        { id: 'FR', name:'France', type:'country' },
        { id: 'ES', name:'Spain', type:'country' },
        { id: 'IT', name:'Italy', type:'country' },
    ]};

    var store = new dojo.data.ItemFileReadStore({
        data: data
    });
    
    var treeModel = new dijit.tree.ForestStoreModel({
        store: store,
        query: {
            "type": "continent"
        },
        rootId: "root",
        rootLabel: "Continents",
        childrenAttrs: ["children"]
    });
    
    new dijit.Tree({
        model: treeModel
    }).placeAt(mainArea.left.domNode);
*/
