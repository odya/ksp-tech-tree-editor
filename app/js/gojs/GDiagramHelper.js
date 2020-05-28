/**
 * Created by odya on 2/1/16.
 */
'use strict';

const LayeredTreeLayout = require(app.getAppPath() + '/app/js/gojs/LayeredTreeLayout.js');
const go = require(app.getAppPath() + '/app/vendor/go.js');
const G = go.GraphObject.make;


class GDiagramHelper {

    static getDiagram() {
        return G(go.Diagram, "treeContainer", {
            initialContentAlignment: go.Spot.Default,
            layout: G(go.TreeLayout, {
                angle: 0,
                nodeSpacing: 10,
                layerSpacing: 50,
                //compaction: go.TreeLayout.CompactionNone,
                alignment: go.TreeLayout.AlignmentCenterSubtrees,
                arrangement: go.TreeLayout.ArrangementVertical,

                //layerStyle: go.TreeLayout.LayerSiblings,
                /*comparer: function(a, b) {
                    // A and B are TreeVertexes
                    if(a.node.data.parentID == 'start') {
                        console.log(a);
                    }
                    var av = a.node.data.cost;
                    var bv = b.node.data.cost;
                    if (av < bv) return -1;
                    if (av > bv) return 1;
                    return 0;
                },
                sorting: go.TreeLayout.SortingAscending*/
            }),
            allowZoom: false,
            allowSelect: true,
            allowTextEdit: false,
            maxSelectionCount: 1,
            allowMove: true,
            autoScale: go.Diagram.None,
            //validCycle: go.Diagram.CycleNotDirected,
            "grid.visible": true,
            "grid.gridCellSize": new go.Size(10, 10),
            "draggingTool.isGridSnapEnabled": true,
            "undoManager.isEnabled": true,
            "animationManager.isEnabled": false,
            //"clickCreatingTool.archetypeNodeData": { text: "Node" },
            //"toolManager.hoverDelay": 100,
            nodeTemplate: this.getNodeTmpl()
        });
    }

    static getNodeTmpl() {
        var portStyle = function() {
            return {
                fill: "green",
                strokeWidth: 1,
                desiredSize: new go.Size(5, 5),
                alignmentFocus: new go.Spot(0, 0, -3, -3),
                //fromSpot: go.Spot.Left,
                //toSpot: go.Spot.Right,
                fromMaxLinks: 1,
                cursor: "pointer"
            }
        }

        return G(go.Node, "Spot", {
                locationSpot: go.Spot.Center,
                locationObjectName: "BODY",
                selectionObjectName: "BODY",
                defaultAlignment: go.Spot.TopLeft,
                //background: "cyan",
                fromSpot: go.Spot.Right,
                toSpot: go.Spot.Left,
                toolTip: G(go.Adornment, "Auto",
                    G(go.Shape, { fill: "#FFFFCC" }),
                    G(go.TextBlock, { margin: 4, font: '"Helvetica Neue", Arial 12px' },
                        new go.Binding("text", "nodeName")
                    )
                ),
                selectionChanged: function(obj,b) {
                    if(obj.isSelected)
                        window.treeInspector.populate(obj.part);
                    else
                        window.treeInspector.clear();
                }
            },
            G(go.Panel, "Vertical", {
                    name: "BODY",
                    padding: 5,
                    background: "#444"
                },
                G(go.Panel, "Horizontal", { height: 36 },
                    G(go.Picture,
                        {
                            background: "green",
                            width: 32,
                            height: 32,
                        },
                        new go.Binding("source", "icon")
                    ),
                    G(go.TextBlock,
                        {
                            margin: new go.Margin(2,0,0,5),
                            font: '"Helvetica Neue", Arial 12px',
                            stroke: "white",
                            desiredSize: new go.Size(70, 32),
                            wrap: go.TextBlock.WrapDesiredSize,
                            editable: true
                        },
                        new go.Binding("text", "title").makeTwoWay()
                    )
                ),
                G(go.Panel, "Table", { margin: new go.Margin(5,0,0,0), stretch: go.GraphObject.Horizontal},
                    G(go.TextBlock, "324",
                        {column: 0, stroke: "white", font: '"Helvetica Neue", Arial 12px', background: '#1976D2'},
                        new go.Binding("text", "cost").makeTwoWay()
                    ),
                    G(go.TextBlock, "232",
                        {column: 1, stroke: "white", font: '"Helvetica Neue", Arial 12px', background: '#C2185B'}
                    ),
                    G(go.TextBlock, "86",
                        {column: 2, stroke: "white", font: '"Helvetica Neue", Arial 12px', background: '#388E3C'}
                    ),
                    G(go.TextBlock, "455",
                        {column: 3, stroke: "white", font: '"Helvetica Neue", Arial 12px', background: '#F57C00'}
                    )
                )
            ),

            G(go.Shape, "Rectangle", portStyle(), {
                alignment: go.Spot.LeftCenter,
                portId: "portIn",
                fromLinkable: false,
                toLinkable: true,
            }),

            G(go.Shape, "Rectangle", portStyle(), {
                alignment: go.Spot.RightCenter,
                portId: "portOut",
                fromLinkable: true,
                toLinkable: false,
            })

/*
            */
            //G(go.TextBlock, "(-40,0)",  { background: 'pink', alignment: new go.Spot(0, 1, -10, 0) })
            //G(go.Shape, "Rectangle", { fill: "lightgray", portId: "", fromLinkable: true, toLinkable: true }),
            /*G(go.Panel, go.Panel.Position,
                G(go.Shape, "Rectangle",
                    { fill: "lightgreen", stroke: null}),

                // Near bottom-left corner:
                G(go.TextBlock, "(-40,0)",  { background: 'pink', alignment: new go.Spot(0, 1, -40, 0) }),
                G(go.TextBlock, "(0,0)",    { background: 'pink', alignment: new go.Spot(0, 1, 0, 0) })
            ),*/
            //new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),


            /*G(go.TextBlock,
                {
                    margin: new go.Margin(5,0,0,0),
                    font: '"Helvetica Neue", Arial 12px',
                    stroke: "white",
                    overflow: go.TextBlock.OverflowEllipsis,
                    maxLines: 5,
                },
                new go.Binding("text", "title")
            )*/
        );
    }

    static getLayeredTreeLayout() {
        return LayeredTreeLayout;
    }
}

module.exports = GDiagramHelper;