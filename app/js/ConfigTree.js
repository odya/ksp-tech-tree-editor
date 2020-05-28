/**
 * Created by odya on 2/23/16.
 */
'use strict';

class ConfigTree {
    readFromFile(filePath) {
        const readline = require('readline');
        const fs = require('fs');

        const rl = readline.createInterface({
            input: fs.createReadStream(filePath)
        });

    }
}

class ConfigTreeNode {

    name = null;
    data = {};
    children = [];

    constructor(objParams) {
        if(objParams.name !== undefined)
            this.name = objParams.name
        if(objParams.data !== undefined)
            this.data = objParams.data
        if(objParams.children !== undefined)
            this.children = objParams.children
    }


}

module.exports = ConfigTree;