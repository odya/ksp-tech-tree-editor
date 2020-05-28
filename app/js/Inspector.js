/**
 * Created by odya on 2/14/16.
 */
'use strict';

const $ = require('jquery');

class Inspector {

    constructor() {
        this.$containerObj = $('#treeInspector');
        this.fieldNames = ['i-id','i-parentId','i-nodeName','i-cost','i-title','i-description','i']
    }

    populate(part) {
        this.part = part;
        for (let key of Object.keys(part.data)) {
            var value = part.data[key];
            var $el = this.$containerObj.find("[name='i-"+key+"']");
            if($el.length == 1) {
                $el.val(value);
            }
        }
        console.log(part.data);
    }

    apply() {
        this.part.data['nodeName'] = this.$containerObj.find("[name='i-nodeName']").val();
    }

    clear() {
        this.$containerObj.find("[name|='i']").val('');
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

module.exports = Inspector;