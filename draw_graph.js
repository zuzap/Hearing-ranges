	"use strict";
	function draw(data){
    var margin = 80,
    	width = 1400 - margin,
    	height = 600 - margin;

    d3.select("body")
        .append("h2")
            .text("Hearing ranges across species");

    var svg = d3.select("body")
    	.append("svg")
    		.attr("width", width + margin)
    		.attr("height", height + margin)
    	.append("g")
    		.attr("class","chart");

    svg.selectAll('line')
        .data(data)
        .enter()
        .append('line')
        .attr('class','datalines');

    // use d3.extent here?

    var freq_scale = d3.scale.log()
    	.domain([10, 200000])
    	.range([margin, width])


    // replace this with an accessive function somehow??
    var y_domain = [];
    for (var i = 0; i < data.length; i++){
        y_domain.push(data[i].Species);
    }

    var species_scale = d3.scale.ordinal()
    	.domain(y_domain)
    	.rangePoints([margin, height]);

    var freq_axis = d3.svg.axis()
        .scale(freq_scale)
        .ticks(20, ",.1s");

    var species_axis = d3.svg.axis()
        .scale(species_scale)
        .orient('left');

    svg.append('g')
        .attr('class','x axis')
        .attr('transform','translate(0,' + height + ')')
        .call(freq_axis);

    svg.append('g')
        .attr('class','y axis')
        .attr('transform','translate(' + margin + ',0)')
        .call(species_axis);

    d3.selectAll('.datalines')
        .attr('x1', function(d){
            return freq_scale(d['LowRange']);
        })
        .attr('x2', function(d){
            return freq_scale(d['HighRange']);
        })
        .attr('y1', function(d){
            return species_scale(d['Species']);
        })
        .attr('y2', function(d){
            return species_scale(d['Species']);
        });

    debugger

    var labels = svg.append("g")
        .attr('class','labels')
        .attr('transform','translate(' + margin + ',' + height + ')')
        .selectAll('g')
        .data(data)
        .enter().append('g');

    labels.append('text')
        .attr('x', function(d){
            return d['LowRange'] - 10;
        })
        .attr('y', function(d,i){
            return 70 + (40*i);
        })
        .attr('text', function(d){
            return d['Species'];
        })

}
