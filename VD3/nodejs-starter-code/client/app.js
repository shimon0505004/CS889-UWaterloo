import './assets/scss/app.scss'

var $ = require('jquery')
var d3 = require('d3')
var Multimap = require('multimap');

$(document).ready(function() {
    $('#helloworld')
        .append('<span>Hello, jQuery! </span>')
    
    d3.select('#helloworld')
        .append('span')
        .html('Hello, D3!');

    var w = 3000, h = 3000
    
    const xOffset = 50
    const yOffset = 50
    const xMargin = 50
    const yMargin = 50

    var margin = {top: yMargin, right: xMargin, bottom: yMargin, left: xMargin},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(".canvas")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform",
            "translate(" + xOffset + "," + yOffset + ")");


    d3.csv('/data/jean-complete-edge.csv', function(d) {
        // convert to numerical values
        d.Id = +d.Id
        return {'source' : d.Source, 'target' : d.Target, 'label': d.Label}
    }).then(function(edgeData) {
 

        d3.csv('/data/jean-complete-node.csv', function(d) {
            return d
        }).then(function(nodeData) {

            var allNodeGroup = d3.map(nodeData, function(d){return(d.Id)}).keys()
            var isGraph = true; 

            var xRectWidth = ((width)/(allNodeGroup.length+1))
            var yRectWidth = ((height)/(allNodeGroup.length+1))

            var nodeInfoMap = new Map()
            nodeData.forEach((d,i)=>{
                let xPos = ((i+1)*(xRectWidth));
                let yPos = ((i+1)*(yRectWidth));
                let n = (((i+1)/(allNodeGroup.length + 1))* 0xfffff * 1000000).toString(16);
                const jsonVar = {
                    'id' : d.Id,
                    'label' : d.Label,
                    'description' : d.Description,
                    'xScalePos' : xPos,
                    'yScalePos' : yPos,
                    'color' : '#' + n.slice(0, 6),
                }
                nodeInfoMap[d.Id] =  jsonVar
            })


            const edgeLabelMap = new Multimap()
            const edgeLabelCountMap = new Map()
            edgeData.forEach((d, i) => {
                const edgeLabelkey = d.source + "," + d.target;
                const edgeLabelCountKey = d.source + "," + d.target + "," + d.label;
                if(!edgeLabelMap.has(edgeLabelkey, d.label)){
                    edgeLabelMap.set(edgeLabelkey, d.label);    
                    edgeLabelCountMap.set(edgeLabelCountKey, 1)
                }else{
                    const currentCount = edgeLabelCountMap.get(edgeLabelCountKey) + 1
                    edgeLabelCountMap.set(edgeLabelCountKey, currentCount)
                }
            })
            var allEdgeGroup = d3.map(edgeData, function(d){return(d.label)}).keys()
            const edgeColorMap = new Map();
            allEdgeGroup.forEach((element,index) => {
                let n = (((index+1)/(allEdgeGroup.length + 1))* 0xfffff * 1000000).toString(16);
                edgeColorMap[element] = '#' + n.slice(0, 6);
            });
            var graph = {'links' : edgeData, 'nodes' : nodeData}
            
            // Initialize the links
            var link = svg.append("g")
            .attr("class","links")
            .selectAll("line")
            .data(graph.links)
            .enter()
                .append("line")


            // Initialize the nodes
            //Help: https://jsfiddle.net/gerardofurtado/7pvhxfzg/1/
            var linkLabel = svg.append("g")
            .attr("class","text")
            .selectAll("text")
            .data(graph.links)
            .enter()            
            .append("text")
                .text(function (d) { 
                    const key1 = d.source + ',' + d.target 
                    const arr = edgeLabelMap.get(key1).sort()[0].toString()
                    return arr; 
                })
                .style("text-anchor", "middle")
                .style("fill", "black")
                .style("font-family", "Arial")
                .style("font-family", "Arial")
                .style("font-size", 12)
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

                    
            // Initialize the nodes
            var node = svg.append("g")
            .attr("class","nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter()            
            .append("circle")
                .attr("r", 12)
                .style("fill",  function (d,i) { return nodeInfoMap[d.Id].color;})
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))

            var rect1 = svg.append("g")
            .attr("class","rect")
            .selectAll("rect")
            .data(graph.links)
            .enter()            
            .append("rect")
                .attr('x', function (d,i) { return nodeInfoMap[d.source].xScalePos;})
                .attr('y', function (d,i) { return nodeInfoMap[d.target].yScalePos;})
                .attr('width', xRectWidth)
                .attr('height', yRectWidth)
                .attr('stroke', 'black')
                .style("visibility","hidden")

            var rect2 = svg.append("g")
                .attr("class","rect")
                .selectAll("rect")
                .data(graph.links)
                .enter()            
                .append("rect")
                    .attr('x', function (d,i) { return nodeInfoMap[d.target].xScalePos;})
                    .attr('y', function (d,i) { return nodeInfoMap[d.source].yScalePos;})
                    .attr('width', xRectWidth)
                    .attr('height', yRectWidth)
                    .attr('stroke', 'black')
                    .style("visibility","hidden")


            var yLines = svg.append("g")
                .attr("class","yLines")
                .selectAll("yLines")
                .data(graph.nodes)
                .enter()            
                .append("line")
                    .attr("x1", function(d) { return nodeInfoMap[d.Id].xScalePos; })
                    .attr("y1", function(d) { return 0; })
                    .attr("x2", function(d) { return nodeInfoMap[d.Id].xScalePos; })
                    .attr("y2", function(d) { return height; })
                    .attr('stroke', 'black')
                    .style("visibility","hidden")

            var xLines = svg.append("g")
            .attr("class","xLines")
            .selectAll("xLines")
            .data(graph.nodes)
            .enter()            
            .append("line")
                .attr("x1", function(d) { return 0; })
                .attr("y1", function(d) { return nodeInfoMap[d.Id].yScalePos; })
                .attr("x2", function(d) { return width; })
                .attr("y2", function(d) { return nodeInfoMap[d.Id].yScalePos; })
                .attr('stroke', 'black')
                .style("visibility","hidden")
                            

            // Initialize the nodes
            var node2 = svg.append("g")
            .attr("class","nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter()            
            .append("circle")
                .attr("r", 12)
                .style("fill",  function (d,i) { return nodeInfoMap[d.Id].color;})
                .style("visibility","hidden")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))

            // Initialize the nodes
            //Help: https://jsfiddle.net/gerardofurtado/7pvhxfzg/1/
            var nodeLabel = svg.append("g")
            .attr("class","text")
            .selectAll("text")
            .data(graph.nodes)
            .enter()            
            .append("text")
                .text(function (d) { return d.Id; })
                .style("text-anchor", "middle")
                .style("fill", function (d,i) { return 'white';})
                .style("font-family", "Arial")
                .style("font-family", "Arial")
                .style("font-size", 12)
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            // Initialize the nodes
            //Help: https://jsfiddle.net/gerardofurtado/7pvhxfzg/1/
            var nodeLabel2 = svg.append("g")
            .attr("class","text")
            .selectAll("text")
            .data(graph.nodes)
            .enter()            
            .append("text")
                .text(function (d) { return d.Id; })
                .style("text-anchor", "middle")
                .style("fill", function (d,i) { return 'white';})
                .style("font-family", "Arial")
                .style("font-family", "Arial")
                .style("font-size", 12)
                .style("visibility","hidden")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
                
            node.append("title")
                .text(function(d) { return 'ID: ' + d.Id + '\n' + 'Label: ' + d.Label + '\n' + 'Description: ' + d.Description; });

            node2.append("title")
            .text(function(d) { return 'ID: ' + d.Id + '\n' + 'Label: ' + d.Label + '\n' + 'Description: ' + d.Description; });

            nodeLabel.append("title")
                .text(function(d) { return 'ID: ' + d.Id + '\n' + 'Label: ' + d.Label + '\n' + 'Description: ' + d.Description; });

            nodeLabel2.append("title")
                .text(function(d) { return 'ID: ' + d.Id + '\n' + 'Label: ' + d.Label + '\n' + 'Description: ' + d.Description; });

            function generateLinkRectTitle(d){
                const stringArr = [];                    
                const key = d.source + ',' + d.target
                const initialStr = nodeInfoMap[d.source].label + " and " + nodeInfoMap[d.target].label + ' First Met in Chapter: ' + edgeLabelMap.get(key).sort()[0].toString();
                stringArr.push(initialStr);
                edgeLabelMap.get(key).forEach(d=>{
                    const newKey = key + ',' + d
                    const newStr = "chapter " + d + " meeting count: " + edgeLabelCountMap.get(newKey);
                    stringArr.push(newStr);
                })

                const returnStr = stringArr.join('\n');
                return returnStr; 
            }    

            link.append("title")
            .text(function(d) { 
                return generateLinkRectTitle(d);
            });

            rect1.append("title")
            .text(function(d) { 
                return generateLinkRectTitle(d);
            });

            rect2.append("title")
            .text(function(d) { 
                return generateLinkRectTitle(d);
            });


            linkLabel.append("title")
            .text(function(d) { 
                return generateLinkRectTitle(d);
            });

            
            // Let's list the force we wanna apply on the network
            var simulation = d3.forceSimulation(graph.nodes)                 // Force algorithm is applied to data.nodes
                .force("link", d3.forceLink()                               // This force provides links between nodes
                        .id(function(d) { return d.Id; })                     // This provide  the id of a node
                        .links(graph.links)                                    // and this the list of links
                )
                .force("charge", d3.forceManyBody().strength(-500))         // This adds repulsion between nodes.
                .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
                .on("tick", ticked);                
            

            // This function is run at each iteration of the force algorithm, updating the nodes position.
            function ticked() {
                if(isGraph){
                    link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                    linkLabel
                        .attr("x", function(d) { return ((d.source.x+d.target.x)/2); })
                        .attr("y", function(d) { return ((d.source.y+d.target.y)/2); });

                    node
                        .attr("cx", function (d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });

                    node2
                        .attr("cx", function (d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });

                    nodeLabel
                        .attr("x", function (d) { return d.x; })
                        .attr("y", function(d) { return d.y+4; });

                    nodeLabel2
                        .attr("x", function (d) { return d.x; })
                        .attr("y", function(d) { return d.y+4; });

                }
            }

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
            
            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }
            
            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            d3.select("#graphbutton")
            .selectAll("input")
            .on("click", function() { 
                var action = d3.select(this).node().value; 
                updateRepresentation(action)
                
            });

            function updateRepresentation(selectedGroup){

                const transitionDuration = 8000;

                if(selectedGroup=="matrix"){
                    isGraph = false;

                    node.transition()
                        .duration(transitionDuration)
                        .style("visibility","visible")
                        .attr("cx", function(d,i) { 
                            return 0;
                        })
                        .attr("cy", function(d,i) { 
                            return (nodeInfoMap[allNodeGroup[i]].yScalePos+yRectWidth-(yRectWidth/2)+(yRectWidth/4)-4); 
                        })
                        .transition()
                        .attr("transform", "translate(0,0) rotate("+270+")")
                        .transition()
                        .style("visibility","hidden");

                    nodeLabel.transition()
                        .duration(transitionDuration)
                        .style("visibility","visible")
                        .attr("x", function (d,i) { return 0; })
                        .attr("y", function(d,i) { return (nodeInfoMap[allNodeGroup[i]].yScalePos+yRectWidth-(yRectWidth/2)+(yRectWidth/4)); })
                        .transition()
                        .attr("transform", "rotate("+270+")")
                        .transition()
                        .style("fill", function (d,i) { return 'black';});                                           

                    node2.transition()
                        .style("visibility","visible")
                        .duration(transitionDuration)
                        .attr("cx", function(d,i) { 
                            return 0;
                        })
                        .attr("cy", function(d,i) { 
                            return (nodeInfoMap[allNodeGroup[i]].yScalePos+yRectWidth-(yRectWidth/2)+(yRectWidth/4)-4); 
                        })
                        .transition()
                        .transition()
                        .style("visibility","hidden");

                    nodeLabel2.transition()
                        .style("visibility","visible")
                        .duration(transitionDuration)
                        .attr("x", function (d,i) { return 0; })
                        .attr("y", function(d,i) { return (nodeInfoMap[allNodeGroup[i]].yScalePos+yRectWidth-(yRectWidth/2)+(yRectWidth/4)); })
                        .transition()
                        .transition()
                        .style("fill", function (d,i) { return 'black';})
                        
                    rect1.transition()
                        .duration(transitionDuration)
                        .transition()
                        .transition()
                        .transition()
                        .duration(transitionDuration)
                        .style("visibility","visible");

                    rect2.transition()
                        .duration(transitionDuration)
                        .transition()
                        .transition()
                        .transition()
                        .duration(transitionDuration)
                        .style("visibility","visible");

                    xLines.transition() 
                        .duration(transitionDuration)
                        .transition()
                        .transition()
                        .transition()
                        .duration(transitionDuration)
                        .style("visibility","visible");   

                    yLines.transition() 
                        .duration(transitionDuration)
                        .transition()
                        .transition()
                        .transition()
                        .duration(transitionDuration)
                        .style("visibility","visible");

                    link.transition()
                        .style("visibility","hidden");

                    linkLabel.transition()
                        .style("visibility","hidden");
                    
    
                }else{
                    rect1.transition()
                        .duration(transitionDuration)
                        .style("visibility","hidden");

                    rect2.transition()
                        .duration(transitionDuration)
                        .style("visibility","hidden");

                    xLines.transition() 
                        .style("visibility","hidden");   

                    yLines.transition() 
                        .style("visibility","hidden");

                    node
                        .transition()
                        .transition()
                        .duration(transitionDuration)
                        .attr("transform", "translate(0,0) rotate("+0+")")
                        .style("visibility","visible")
                        .attr("cx", function (d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });

                    nodeLabel
                        .transition()
                        .style("fill", function (d,i) { return 'white';})
                        .transition()
                        .duration(transitionDuration)
                        .attr("transform", "translate(0,0) rotate("+0+")")
                        .attr("x", function (d,i) { return d.x; })
                        .attr("y", function(d,i) { return d.y; })
                        

                    node2
                        .transition()
                        .transition()
                        .style("visibility","visible")
                        .transition()
                        .duration(transitionDuration)
                        .attr("cx", function (d) { return d.x; })
                        .attr("cy", function(d) { return d.y; })
                        .transition()
                        .style("visibility","hidden");

                    nodeLabel2
                        .transition()
                        .transition()
                        .style("fill", function (d,i) { return 'white';})
                        .transition()
                        .duration(transitionDuration)
                        .attr("x", function (d,i) { return d.x; })
                        .attr("y", function(d,i) { return d.y; })
                        .transition()
                        .style("visibility","hidden");

                    link
                        .transition()
                        .duration(transitionDuration)
                        .transition()
                        .transition()
                        .attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; })
                        .style("visibility","visible");
    
                    linkLabel
                        .transition()
                        .duration(transitionDuration)
                        .transition()
                        .transition()
                        .transition()
                        .style("visibility","visible")
                        .attr("x", function(d) { return ((d.source.x+d.target.x)/2); })
                        .attr("y", function(d) { return ((d.source.y+d.target.y)/2); });


                    isGraph = true;

                }
            }
           
        })      
    }) 
})