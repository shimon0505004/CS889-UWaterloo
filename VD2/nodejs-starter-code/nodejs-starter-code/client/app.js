import './assets/scss/app.scss'

var $ = require('jquery')
var d3 = require('d3')

$(document).ready(function() {
    $('#helloworld')
        .append('<span>Hello, jQuery! </span>')
    
    d3.select('#helloworld')
        .append('span')
        .html('Hello, D3!');

    var width = 400, height = 400, offset = 100    
    var w = 2*(width+offset), h = 2*(height+offset)

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10)

    d3.csv('/data/pca_dataset.csv', function(d) {
        // convert to numerical values
        d.xvalue = +d.xvalue
        d.yvalue = +d.yvalue
        d.label = +d.label

        return d
    }).then(function(data) {
        // Your d3 drawing code comes here
        // The below example draws a simple "scatterplot"
        console.log(data)

        const xMax = d3.max(data, function(d){return Math.abs(d.xvalue);})
        console.log(xMax)
        const yMax = d3.max(data, function(d){return Math.abs(d.yvalue);})
        console.log(yMax)



        d3.select('.canvas1')
            .selectAll('.square')
            .data([0,1,2,3,4,5,6,7,8,9])
            .enter()
            .append("rect")
            .attr('x', function(d,i){return (100+((50+30)*(d)));})
            .attr('y', 10)
            .attr('width', 50)
            .attr('height', 50)
            .attr('stroke', 'black')
            .attr('fill', function(d,i){return colorScale(d);})
            .append('title') // Tooltip
            .text(function (d, i) { return 'Color of Label : '+ d ;})
      
        d3.select('.canvas1')
            .append("rect")
            .attr('x', 5)
            .attr('y', 5)
            .attr('width', 990)
            .attr('height', 60)
            .attr('stroke', 'black')
            .style("fill", "none")
            .attr('stroke-width',3)
        
        d3.select('.canvas1')
            .selectAll("text")
            .data([0,1,2,3,4,5,6,7,8,9])
            .enter()
            .append("text")
            .attr('x', function(d,i){return (100+20+((50+30)*(d)));})
            .attr('y', 10+35)
            .attr('stroke', 'black')
            .style("font-size", "30px")
            .text(function(d){return d;})     

        d3.select('.canvas1')
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', function(d,i){return "image1_pt"+i})
            .attr('cx', function(d) {
                return (width+offset) + (d.xvalue / xMax * width);
            })
            .attr('cy', function(d) {
                return (height+offset) + (d.yvalue / yMax * height);
            })
            .attr('r', 3)
            .attr('fill',function (d,i) { return colorScale(d.label); })
            .attr('data-legend',function (d,i) { return d.label; })
            .on('mouseover', function (d,i) {
                var sel1 = d3.selectAll('circle.image1_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 30)

                var sel2 = d3.select('circle.image2_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 30)

                var sel3 = d3.select('circle.image3_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 30)
            })
            .on('mouseout', function (d,i) {

                var sel1 = d3.selectAll('circle.image1_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 3)

                var sel2 = d3.select('circle.image2_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 3)

                var sel3 = d3.select('circle.image3_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 3)
            })
            .append('title') // Tooltip
            .text(function (d, i) { return 'X : '+ d.xvalue +
                                    '\n Y : '+ d.yvalue +
                                    '\n Label : '+ d.label 
                                })
            

            const xMaxAct = d3.max(data, function(d){return (d.xvalue);})
            console.log(xMaxAct)
            const yMaxAct = d3.max(data, function(d){return (d.yvalue);})
            console.log(yMaxAct)
            const xMinAct = d3.min(data, function(d){return (d.xvalue);})
            console.log(xMinAct)
            const yMinAct = d3.min(data, function(d){return (d.yvalue);})
            console.log(yMinAct)            
            var xScale = d3.scaleLinear()
                            .domain([xMinAct,xMaxAct])
                            .range([0, 2*width])
            // Add scales to axis
            var x_axis = d3.axisBottom()
                .scale(xScale).tickSizeOuter(0);      

            var yScale = d3.scaleLinear()
            .domain([yMinAct,yMaxAct])
            .range([0, 2*height])
            // Add scales to axis
            var y_axis = d3.axisLeft()
            .scale(yScale).tickSizeOuter(0); 
                                
             // X-axis
             d3.select('.canvas1')
            .append('g')
            .attr('class','axis')
            .attr('transform', 'translate('+ 100 +',' + 920 + ')')
            .call(x_axis)

            // X-axis Labels
            d3.select('.canvas1')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 460)
            .attr("y", 970)
            .text("X");

            // Y-axis
            d3.select('.canvas1')
            .append('g')
            .attr('class','axis')
            .attr('transform', 'translate('+ 80 +',' + 100 + ')')
            .call(y_axis)

            // Y-axis Labels
            d3.select('.canvas1')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 50)
            .attr("y", 440)
            .text("Y");


            // Y-axis Labels
            d3.select('.canvas1')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 500)
            .attr("y", 100)
            .text("Labels");

            // Y-axis Labels
            d3.select('.canvas1')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 950)
            .attr("y", 970)
            .text("PCA");
                
    }) 

    d3.csv('/data/mds_dataset.csv', function(d) {
        // convert to numerical values
        d.xvalue = +d.xvalue
        d.yvalue = +d.yvalue
        d.label = +d.label

        return d
    }).then(function(data) {
        // Your d3 drawing code comes here
        // The below example draws a simple "scatterplot"
        console.log(data)

        const xMax = d3.max(data, function(d){return Math.abs(d.xvalue);})
        console.log(xMax)
        const yMax = d3.max(data, function(d){return Math.abs(d.yvalue);})
        console.log(yMax)

        d3.select('.canvas2')
            .selectAll('.square')
            .data([0,1,2,3,4,5,6,7,8,9])
            .enter()
            .append("rect")
            .attr('x', function(d,i){return (100+((50+30)*(d)));})
            .attr('y', 10)
            .attr('width', 50)
            .attr('height', 50)
            .attr('stroke', 'black')
            .attr('fill', function(d,i){return colorScale(d);})
            .append('title') // Tooltip
            .text(function (d, i) { return 'Color of Label : '+ d ;})

        d3.select('.canvas2')
            .append("rect")
            .attr('x', 5)
            .attr('y', 5)
            .attr('width', 990)
            .attr('height', 60)
            .attr('stroke', 'black')
            .style("fill", "none")
            .attr('stroke-width',3)
            
        d3.select('.canvas2')
            .selectAll("text")
            .data([0,1,2,3,4,5,6,7,8,9])
            .enter()
            .append("text")
            .attr('x', function(d,i){return (100+20+((50+30)*(d)));})
            .attr('y', 10+35)
            .attr('stroke', 'black')
            .style("font-size", "30px")
            .text(function(d){return d;})

        d3.select('.canvas2')
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', function(d,i){return "image2_pt"+i})
            .attr('cx', function(d) {
                return (width+offset) + (d.xvalue / xMax * width);
            })
            .attr('cy', function(d) {
                return (height+offset) + (d.yvalue / yMax * height);
            })
            .attr('r', 3)
            .attr('fill',function (d,i) { return colorScale(d.label) })
            .on('mouseover', function (d,i) {
                var sel1 = d3.selectAll('circle.image1_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 30)

                var sel2 = d3.select('circle.image2_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 30)

                var sel3 = d3.select('circle.image3_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 30)
            })
            .on('mouseout', function (d,i) {

                var sel1 = d3.selectAll('circle.image1_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 3)

                var sel2 = d3.select('circle.image2_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 3)

                var sel3 = d3.select('circle.image3_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 3)
            })
            .append('title') // Tooltip
            .text(function (d, i) { return 'X : '+ d.xvalue +
                                '\n Y : '+ d.yvalue +
                                '\n Label : '+ d.label 
                            })


            const xMaxAct = d3.max(data, function(d){return (d.xvalue);})
            console.log(xMaxAct)
            const yMaxAct = d3.max(data, function(d){return (d.yvalue);})
            console.log(yMaxAct)
            const xMinAct = d3.min(data, function(d){return (d.xvalue);})
            console.log(xMinAct)
            const yMinAct = d3.min(data, function(d){return (d.yvalue);})
            console.log(yMinAct)            
            var xScale = d3.scaleLinear()
                            .domain([xMinAct,xMaxAct])
                            .range([0, 2*width])
            // Add scales to axis
            var x_axis = d3.axisBottom()
                .scale(xScale).tickSizeOuter(0);      

            var yScale = d3.scaleLinear()
            .domain([yMinAct,yMaxAct])
            .range([0, 2*height])
            // Add scales to axis
            var y_axis = d3.axisLeft()
            .scale(yScale).tickSizeOuter(0); 
                                
                // X-axis
            d3.select('.canvas2')
            .append('g')
            .attr('class','axis')
            .attr('transform', 'translate('+ 100 +',' + 920 + ')')
            .call(x_axis)

            // X-axis Labels
            d3.select('.canvas2')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 460)
            .attr("y", 970)
            .text("X");

            // Y-axis
            d3.select('.canvas2')
            .append('g')
            .attr('class','axis')
            .attr('transform', 'translate('+ 80 +',' + 100 + ')')
            .call(y_axis)

            // Y-axis Labels
            d3.select('.canvas2')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 50)
            .attr("y", 500)
            .text("Y");


            // Y-axis Labels
            d3.select('.canvas2')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 500)
            .attr("y", 100)
            .text("Labels");


            // Y-axis Labels
            d3.select('.canvas2')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 950)
            .attr("y", 970)
            .text("MDS");
            
    }) 

    d3.csv('/data/tsne_dataset.csv', function(d) {
        // convert to numerical values
        d.xvalue = +d.xvalue
        d.yvalue = +d.yvalue
        d.label = +d.label

        return d
    }).then(function(data) {
        // Your d3 drawing code comes here
        // The below example draws a simple "scatterplot"
        console.log(data)

        const xMax = d3.max(data, function(d){return Math.abs(d.xvalue);})
        console.log(xMax)
        const yMax = d3.max(data, function(d){return Math.abs(d.yvalue);})
        console.log(yMax)

        d3.select('.canvas3')
            .selectAll('.square')
            .data([0,1,2,3,4,5,6,7,8,9])
            .enter()
            .append("rect")
            .attr('x', function(d,i){return (100+((50+30)*(d)));})
            .attr('y', 10)
            .attr('width', 50)
            .attr('height', 50)
            .attr('stroke', 'black')
            .attr('fill', function(d,i){return colorScale(d);})
            .append('title') // Tooltip
            .text(function (d, i) { return 'Color of Label : '+ d ;})

        d3.select('.canvas3')
            .append("rect")
            .attr('x', 5)
            .attr('y', 5)
            .attr('width', 990)
            .attr('height', 60)
            .attr('stroke', 'black')
            .style("fill", "none")
            .attr('stroke-width',3)

        d3.select('.canvas3')
            .selectAll("text")
            .data([0,1,2,3,4,5,6,7,8,9])
            .enter()
            .append("text")
            .attr('x', function(d,i){return (100+20+((50+30)*(d)));})
            .attr('y', 10+35)
            .attr('stroke', 'black')
            .style("font-size", "30px")
            .text(function(d){return d;})

        d3.select('.canvas3')
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', function(d,i){return "image3_pt"+i})
            .attr('cx', function(d) {
                return (width+offset) + (d.xvalue / xMax * width);
            })
            .attr('cy', function(d) {
                return (height+offset) + (d.yvalue / yMax * height);
            })
            .attr('r', 3)
            .attr('fill',function (d,i) { return colorScale(d.label) })
            .on('mouseover', function (d,i) {
                var sel1 = d3.selectAll('circle.image1_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 30)

                var sel2 = d3.select('circle.image2_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 30)

                var sel3 = d3.select('circle.image3_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 30)
            })
            .on('mouseout', function (d,i) {

                var sel1 = d3.selectAll('circle.image1_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 3)

                var sel2 = d3.select('circle.image2_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 3)

                var sel3 = d3.select('circle.image3_pt' + i)
                .transition()
                .duration(500)
                .attr('r', 3)
            })
            .append('title') // Tooltip
            .text(function (d, i) { return 'X : '+ d.xvalue +
                                '\n Y : '+ d.yvalue +
                                '\n Label : '+ d.label 
                            })
                            
                            
            const xMaxAct = d3.max(data, function(d){return (d.xvalue);})
            console.log(xMaxAct)
            const yMaxAct = d3.max(data, function(d){return (d.yvalue);})
            console.log(yMaxAct)
            const xMinAct = d3.min(data, function(d){return (d.xvalue);})
            console.log(xMinAct)
            const yMinAct = d3.min(data, function(d){return (d.yvalue);})
            console.log(yMinAct)            
            var xScale = d3.scaleLinear()
                            .domain([xMinAct,xMaxAct])
                            .range([0, 2*width])
            // Add scales to axis
            var x_axis = d3.axisBottom()
                .scale(xScale).tickSizeOuter(0);      

            var yScale = d3.scaleLinear()
            .domain([yMinAct,yMaxAct])
            .range([0, 2*height])
            // Add scales to axis
            var y_axis = d3.axisLeft()
            .scale(yScale).tickSizeOuter(0); 
                                
                // X-axis
            d3.select('.canvas3')
            .append('g')
            .attr('class','axis')
            .attr('transform', 'translate('+ 100 +',' + 920 + ')')
            .call(x_axis)

            // X-axis Labels
            d3.select('.canvas3')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 460)
            .attr("y", 970)
            .text("X");

            // Y-axis
            d3.select('.canvas3')
            .append('g')
            .attr('class','axis')
            .attr('transform', 'translate('+ 80 +',' + 100 + ')')
            .call(y_axis)

            // Y-axis Labels
            d3.select('.canvas3')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 30)
            .attr("y", 500)
            .text("Y");


            // Y-axis Labels
            d3.select('.canvas3')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 500)
            .attr("y", 100)
            .text("Labels");

            // Y-axis Labels
            d3.select('.canvas3')
            .append('text')
            .attr('class','label')
            .attr("text-anchor", "end")
            .attr("x", 950)
            .attr("y", 970)
            .text("TSNE");
    }) 

})