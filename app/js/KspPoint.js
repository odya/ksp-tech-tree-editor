/**
 * Created by odya on 1/24/16.
 */
'use strict';

var Point = require('point-geometry')

class KspPoint extends Point {

    static fromKspString(str){
        var arr = str.split(',');
        var obj = new KspPoint(parseInt(arr[0]), parseInt(arr[1]));
        obj.z = parseInt(arr[2]);
        return obj;
    }

    normalize(base) {
        var a = this.sub(base);
        this.x = a.x;
        this.y = a.y;
    }

    toString() {
        return '[]'
    }
}

module.exports = KspPoint;