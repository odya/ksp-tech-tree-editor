/**
 * Created by odya on 1/22/16.
 */
'use strict';

const $ = require('jquery');
const KspPoint = require(app.getAppPath() + '/app/js/KspPoint.js');

class TechTreeNode {

    constructor(params) {
        this.id = null;
        this.title = null;
        this.description = null;
        this.cost = null;
        this.hideEmpty = null;
        this.nodeName = null;
        this.anyToUnlock = null;
        this.icon = null;
        this.pos = null;
        this.scale = null;
        this.parentID = null;
        this.lineFrom = null;
        this.lineTo = null;
    }

    static createFromCfg(cfg) {
        var treeNode = new this;

        var rePattern = /^\s*([a-z]+)\s*=\s*(.*?)$/mig;
        var matches;
        while (matches = rePattern.exec(cfg)) {
            var m = matches[1];
            if(m == 'pos') {
                treeNode.pos = KspPoint.fromKspString(matches[2]);
            } else if(m == 'cost') {
                treeNode.cost = parseInt(matches[2]);
            } else {
                treeNode[m] = matches[2];
            }
        }

        return treeNode;
    }

    render() {
        /*console.log(app.gameDataDir);
        var html = `<div class="node" id="${this.id}">
            <div class="topConnector"></div>
            <img class="icon" src="file://${this.getIconPath()}">
            <span class="title">${this.title}</span>
            </div>`;
        var nodeObj = $(html).eq(0);
        nodeObj.css({
            left: this.pos.x,
            top: this.pos.y
        })

        $(window.treeContainer).append(nodeObj);*/
    }

    getDiagramData() {
        var data = JSON.parse(JSON.stringify(this));
        data.key = this.id;

        if(this.parentID === null) {
            //this.parent = '';
        } else {
            data.parent = this.parentID;
        }
        data.pos = `${this.pos.x} ${this.pos.y}`
        data.icon = this.getIconPath();
        return data;
    }

    getIconPath() {
        var simpleIconsDir = `${app.gameDataDir}/Squad/PartList/SimpleIcons`;
        var defaultName = this.icon;
        var makePath = function(name) {
            return simpleIconsDir + '/' + `${name}.png`
        }
        /* Try default name */
        if(fs.existsSync(makePath(defaultName)))
            return makePath(defaultName);

        var matches = this.icon.match(/RDicon_(\w+)-?(\w+)?/);
        if(matches) {
            var base = matches[1].toLowerCase();
            var prefix = matches[2]!==undefined ? matches[2].toLowerCase() : '';
            if(prefix == 'advanced') prefix = 'adv';
            var name = `R&D_node_icon_${prefix}${base}`
            if(fs.existsSync(makePath(name)))
                return makePath(name);
        }

        return __dirname + '/../img/undefined_icon.png';
    }

}


module.exports = TechTreeNode;