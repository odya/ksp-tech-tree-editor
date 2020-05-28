/**
 * Created by odya on 1/20/16.
 */
'use strict';

const Point = require('point-geometry');
const XRegExp = require('xregexp');
const go = require(app.getAppPath() + '/app/vendor/go.js');
const GDiagramHelper = require(app.getAppPath() + '/app/js/gojs/GDiagramHelper.js');
const G = go.GraphObject.make;

class TechTree {

    constructor() {
        this.nodes = new Array;
        this.kspBase = null;
        this.minX = null;
        this.maxX = null;
        this.minY = null;
        this.maxY = null;
    }

    readFromFile(filePath) {
        /** Read file **/
        var treeStr = fs.readFileSync(filePath, 'utf8');
        /** Match nodes **/
        var rePattern = /(RDNode)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g;
        var arrMatches = treeStr.match(rePattern);
        /** Create node objects **/
        arrMatches.forEach((cfg) => {
            var treeNode = TechTreeNode.createFromCfg(cfg);

            if(treeNode.pos.x < this.minX || util.isNull(this.minX))
                this.minX = treeNode.pos.x;
            else if(treeNode.pos.x > this.maxX || util.isNull(this.maxX))
                this.maxX = treeNode.pos.x;
            if(treeNode.pos.y < this.minY || util.isNull(this.minY))
                this.minY = treeNode.pos.y;
            else if(treeNode.pos.y > this.maxY || util.isNull(this.maxY))
                this.maxY = treeNode.pos.y;

            this.nodes.push(treeNode);
        })

        /*window.treeContainer.style.width = (this.maxX - this.minX) + 'px';
        window.treeContainer.style.height = (this.maxY - this.minY) + 'px';*/
        /*window.treeContainer.style.width = 400 + 'px';
        window.treeContainer.style.height = 400 + 'px';*/

        this.treeDiagram = GDiagramHelper.getDiagram();
        this.treeDiagram.nodeTemplate = GDiagramHelper.getNodeTmpl();

        //this.treeDiagram.nodeTemplateMap.add("Bands", GDiagramHelper.getLayeredTreeLayout().getBandsCfg());

        /*this.treeDiagram.add(
            G(go.Part, "Vertical",
                G(go.TextBlock, {text: "a Text Block"}),
                G(go.TextBlock, {text: "a Text Block", stroke: "red"}),
                G(go.TextBlock, {text: "a Text Block", background: "lightblue"}),
                G(go.TextBlock, {text: "a Text Block", font: "bold 14pt serif"})
            )
        );*/

        this.treeDiagram.linkTemplate = G(go.Link, {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpGap,
            corner: 10,
            relinkableFrom: true,
            relinkableTo: true,
            fromShortLength: 3,
            toShortLength: 3
        },
            /*{ routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 10, reshapable: true },*/
            /*{ routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 10, reshapable: true, toShortLength: 0 },*/
            //new go.Binding("points").makeTwoWay(),
            // mark each Shape to get the link geometry with isPanelMain: true
            G(go.Shape, { isPanelMain: true, stroke: "orange", strokeWidth: 2 })
        );

        /*var nodeDataArray = [
            { key: "Alpha", title: "lightblue" },
            { key: "Beta", parent: "Alpha", title: "yellow" },  // note the "parent" property
            { key: "Gamma", parent: "Alpha", title: "orange" },
            { key: "Delta", parent: "Alpha", title: "lightgreen" },
            { key: "Psi", parent: "Gamma", title: "lightgreen" }
        ];
        this.treeDiagram.model = new go.TreeModel(nodeDataArray);*/


        this.kspBase = new Point(this.minX, this.minY);
        this.nodes.forEach((node) => {
            node.pos.normalize(this.kspBase);
        })
        console.log(this);

        this.loadParts();

        this.render();
    }

    render() {
        var model = new go.TreeModel();
        //model.nodeKeyProperty = "id"
        //model.nodeParentKeyProperty = "parentID"

        //var arr = new Array();
        this.nodes.forEach((node) => {
            var data = node.getDiagramData();
            model.addNodeData(data);
        })

        this.treeDiagram.model = model;

        //this.makeInspector();
    }

    makeInspector() {
        var inspector = new Inspector('treeInspector', this.treeDiagram, {
            acceptButton: true,
            resetButton: true,
            /*
             // example predicate, only show data objects:
             inspectPredicate: function(value) {
             return !(value instanceof go.GraphObject)
             }
             */
        });

        window.treeInspector = inspector;
    }

    loadParts() {
        var filePath = app.configCacheFile;
        //var filePath = app.getAppPath() + '/parts_test';

        const readline = require('readline');
        const fs = require('fs');
        const rl = readline.createInterface({
          input: fs.createReadStream(filePath)
        });

        var nodeTmpl = {name: null, data:{}, children:[]};
        var tree = {
            name: 'root',
            data:{},
            children:[],
            getByStack: function(stack){
                //console.log(stack);
                //if(stack.length == 0) return this;
                var node = this;
                var i = 0;
                for(i=0; i<stack.length; i++) {
                    //console.log('i', i, stack.length)
                    node = node.children[stack[i]];
                }
                return node;
            }
        };
        var dataRegex = new RegExp(/^\s*(\w+)\s*=\s*(.+?)\s*(?:\/\/.*?)?$/i);
        var nameRegex = new RegExp(/^\s*([^=\s{}]+)\s*$/i);
        var leftBracketRegex = new RegExp(/^\s*\{\s*$/i);
        var rightBracketRegex = new RegExp(/^\s*\}\s*$/i);
        var commentRegex = new RegExp(/^(.*?)\/\/.*?$/);
        var lineNum = 1;
        var lastName = null;
        var treeIndexStack = [];
        rl.on('line', (line) => {
            var matches;
            if(matches = line.match(commentRegex)) {
                // COMMENT
                line = matches[1];
            }
            if(matches = line.match(dataRegex)) {
                // DATA
                lastName = null;
                var currentNode = tree.getByStack(treeIndexStack);
                currentNode.data[matches[1]] = matches[2];
                //console.log(matches);
            } else if(matches = line.match(nameRegex)) {
                // NAME
                lastName = matches[1];
            } else if(matches = line.match(leftBracketRegex)) {
                // {
                if(lastName) {
                    // Create node
                    //console.log('create node', lastName, lineNum);
                    var currentNode = tree.getByStack(treeIndexStack);
                    var node = (JSON.parse(JSON.stringify(nodeTmpl)));
                    node.name = lastName;
                    var newIdx = currentNode.children.length;
                    currentNode.children.push(node);
                    treeIndexStack.push(newIdx);
                }
                lastName = null;
            } else if(matches = line.match(rightBracketRegex)) {
                // }
                lastName = null;
                treeIndexStack.pop();
            }
            lineNum++;
        });

        rl.on('close', function() {
            console.log('END');
            console.log(tree);
        });

        /*var contents = fs.readFileSync(filePath);
        var r = new RegExp(/PART\s*\{/g);
        var m;
        while (m = r.exec(contents)) {
            console.log(m);
        }*/
        //var configTree = this.readPartsLevelRecursive(contents);
        //console.log(configTree);
    }

    readPartsLevelRecursive_old(str) {
        var tree = new Array;
        var levelItemRegex = /^(.*)$/gm;
        var levelItemMatches;
        while (levelItemMatches = levelItemRegex.exec(str)) {
            //console.log(levelItemMatches);
        }
        console.log(tree);
        return tree;


        var levelItemsMatches = XRegExp.matchRecursive(str, '{', '}', 'gi', {
            valueNames: ['before', null, 'match', null]
        });
        if(levelItemsMatches.length < 1)
            return false;
        var i = 1;
        for(i=1; i<=levelItemsMatches.length; i+2) {
            //console.log(i);
        }

        levelItemsMatches.forEach((obj) => {
            if(obj.name == 'before') {
                var nameMatches = RegExp(/^\s*([^=\s]+)\s*$\s*\{/mi).exec(obj.value);
                if(nameMatches == null) return false;
                tree[i] = {name: null, data:{}, children:[]};
                tree[i].name = nameMatches[1];
            } else if(obj.name == 'match') {
                var dataStr = obj.value.replace(RegExp(/{(\n|.)*}/), '');
                var dataRegex = /^\s*(\w+)\s*=\s*(.+?)\s*$/gm;
                var dataMatches;
                if(tree[i] === undefined) {
                    //console.log(str);
                    return false;
                }
                while (dataMatches = dataRegex.exec(dataStr)) {
                    tree[i].data[dataMatches[1]] = dataMatches[2];
                }
                var children = this.readPartsLevelRecursive(obj.value);
                if(children !== false) {
                    tree[i].children = children;
                }
                i++;
            }
        })
        return tree;
    }
}


module.exports = TechTree;
