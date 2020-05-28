/**
 * Created by odya on 1/31/16.
 */
'use strict';

const go = require(app.getAppPath() + '/app/vendor/go.js');
const G = go.GraphObject.make;

function LayeredTreeLayout() {
    go.TreeLayout.call(this);
    this.layerStyle = go.TreeLayout.LayerUniform;  // needed for straight layers
}
go.Diagram.inherit(LayeredTreeLayout, go.TreeLayout);

/** @override */
LayeredTreeLayout.prototype.commitLayers = function(layerRects, offset) {
    // update the background object holding the visual "bands"
    /*console.log(layerRects);
    layerRects.forEach((layerRect) => {
        var bandLoc = this.arrangementOrigin.copy().add(offset);
        this.diagram.model.setDataProperty({text:'test'}, "bounds", layerRect);
    })*/
    var bands = this.diagram.findPartForKey("_BANDS");
    if (bands) {
        var model = this.diagram.model;
        bands.location = this.arrangementOrigin.copy().add(offset);

        // make each band visible or not, depending on whether there is a layer for it
        for (var it = bands.elements; it.next(); ) {
            var idx = it.key;
            var elt = it.value;  // the item panel representing a band
            elt.visible = idx < layerRects.length;
        }

        // set the bounds of each band via data binding of the "bounds" property
        var arr = bands.data.itemArray;
        for (var i = 0; i < layerRects.length; i++) {
            var itemdata = arr[i];
            if (itemdata) {
                model.setDataProperty(itemdata, "bounds", layerRects[i]);
            }
        }
    }
};

LayeredTreeLayout.getBandsCfg = function() {
    return G(go.Part, "Position", new go.Binding("itemArray"), {
        isLayoutPositioned: false,  // but still in document bounds
        locationSpot: new go.Spot(0, 0, 0, 16),  // account for header height
        layerName: "Background",
        pickable: false,
        selectable: false,
        itemTemplate: G(go.Panel, "Vertical",
            new go.Binding("position", "bounds", function (b) {
                return b.position;
            }),
            G(go.TextBlock,
                {
                    angle: 0,
                    textAlign: "center",
                    wrap: go.TextBlock.None,
                    stroke: "white",
                    font: "bold 11pt Helvetica Neue, Arial"
                },
                new go.Binding("text"),
                // always bind "width" because the angle does the rotation
                new go.Binding("width", "bounds", function (r) {
                    return r.width;
                })
            ),
            // option 1: rectangular bands:
            G(go.Shape,
                {stroke: null, strokeWidth: 0},
                new go.Binding("desiredSize", "bounds", function (r) {
                    return r.size;
                }),
                new go.Binding("fill", "itemIndex", function (i) {
                    return i % 2 == 0 ? "rgba(100,100,50,0.4)" : "rgba(200,30,50,0.4)";
                }).ofObject())
            // option 2: separator lines:
            //(HORIZONTAL
            //  ? $(go.Shape, "LineV",
            //      { stroke: "gray", alignment: go.Spot.TopLeft, width: 1 },
            //      new go.Binding("height", "bounds", function(r) { return r.height; }),
            //      new go.Binding("visible", "itemIndex", function(i) { return i > 0; }).ofObject())
            //  : $(go.Shape, "LineH",
            //      { stroke: "gray", alignment: go.Spot.TopLeft, height: 1 },
            //      new go.Binding("width", "bounds", function(r) { return r.width; }),
            //      new go.Binding("visible", "itemIndex", function(i) { return i > 0; }).ofObject())
            //)
        )
    })
};

module.exports = LayeredTreeLayout;