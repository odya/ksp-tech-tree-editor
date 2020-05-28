/**
 * Created by odya on 1/19/16.
 */

window.remote = require('remote');
var app = remote.app;
const dialog = remote.require('dialog');
const fs = remote.require('fs');
const util = remote.require('util');
//var ffi = remote.require('ffi');

const TechTree = require('./js/TechTree.js');
const TechTreeNode = require('./js/TechTreeNode.js');
const Inspector = require('./js/Inspector.js');

/** for debug */
app.kspDir = '/Users/odya/Library/Application Support/Steam/steamapps/common/Kerbal Space Program'
app.gameDataDir = app.kspDir + '/GameData'
app.techTreeFile = app.gameDataDir + '/ModuleManager.TechTree'
app.configCacheFile = app.gameDataDir + '/ModuleManager.ConfigCache'

app.mainWindow.webContents.on('did-finish-load', function() {
    window.treeContainer = document.getElementById('treeContainer');
    window.techTree = new TechTree();
    window.treeInspector = new Inspector();
    techTree.readFromFile(app.gameDataDir + '/ModuleManager.TechTree');

    /*var libm = ffi.Library(app.gameDataDir+'/ModuleManager.2.6.24.dll', {
      'ceil': [ 'double', [ 'double' ] ]
    });
    var a = libm.ceil(1.5);
    console.log(a);*/
});

function selectKspDir() {
    dialog.showOpenDialog({properties:['openDirectory']}, function(dirNames){
        app.kspDir = dirNames[0]
        app.gameDataDir = app.kspDir + '/GameData'
        app.techTreeFile = app.gameDataDir + '/ModuleManager.TechTree'
        app.configCacheFile = app.gameDataDir + '/ModuleManager.ConfigCache'
        var dirContent = fs.readdirSync(app.gameDataDir);
        console.log(dirContent)
    })
}