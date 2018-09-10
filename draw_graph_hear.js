var draw = function(dataset) {
  var margin = {top:50, bottom:20, left:50, right:50};
  var w = 900 - margin.left - margin.right,
      h = 600 - margin.top - margin.bottom;

  var barWidth = 24;

  var svg = d3.select("body")
              .append("svg")
                .attr("width",w + margin.left + margin.right)
                .attr("height",h + margin.top + margin.bottom)
              .append("g") // margin convention
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// scales
  var xScale = d3.scaleLog()
                .domain([10,200000])
                .range([0,w]);

  var yScale = d3.scaleBand()
                .domain(d3.range(dataset.length))
                .range([0,h])
                .padding(0.3);

// draw bars
  ghearing = svg.append("g")
                .attr("id","hear");

  ghearing.selectAll("line")
      .data(dataset)
      .enter()
      .append("line")
        .style("stroke-width",barWidth)
        .attr("x1",function(d){return xScale(d.LowRange)})
        .attr("x2",function(d){return xScale(d.HighRange)})
        .attr("y1",function(d,i){return yScale(i)})
        .attr("y2",function(d,i){return yScale(i)})
        .attr("class",function(d){return "bars "+d.Type});

// add text to bars
  svg.selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
        .attr("x",function(d){return xScale(d.LowRange)+5})
        .attr("y",function(d,i){return yScale(i)})
        .attr("class","bars")
        .text(function(d,i){return dataset[i].Species})

// define axes
  var xAxis = d3.axisBottom(xScale)
                .tickFormat(function(d){
                  return xScale.tickFormat(5,d3.format(",d"))(d)
                });
  var xAxisTop = d3.axisTop(xScale)
                    .tickFormat(function(d){
                      return xScale.tickFormat(5,d3.format(",d"))(d)
                    });

// vertical lines
  var vertline1 = svg.append("line")
    .attr("class","vertlines")
    .attr("x1",100)
    .attr("x2",100)
    .attr("y1",0)
    .attr("y2",h)
    .attr("visibility","hidden");

  var vertline2 = svg.append("line")
    .attr("class","vertlines")
    .attr("x1",400)
    .attr("x2",400)
    .attr("y1",0)
    .attr("y2",h)
    .attr("visibility","hidden");

// draw axes
  svg.append("g")
      .attr("class","axis")
      .attr("transform","translate(0," + h + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class","axis")
      .call(xAxisTop)
      .attr("transform","translate(0,-20)");
  svg.append("text")
      .attr("class", "xlabel")
      .attr("text-anchor", "end")
      .attr("x", w)
      .attr("y", 0)
      .text("Frequency in Hz");

// on-click behaviour

  ghearing.selectAll(".bars")
    .on("click", function(d) {
        var low = Number(d.LowRange),
            high = Number(d.HighRange);

        d3.selectAll(".bars").each(function(d) {
          d3.select(this).classed("focus",false);
          if (Number(d.HighRange) < low || Number(d.LowRange) > high) {
            d3.select(this).classed("outside", true)
            d3.select(this).classed("half", false)
            d3.select(this).classed("within", false)
          } else if (Number(d.LowRange)<low || Number(d.HighRange)>high) {
            d3.select(this).classed("outside", false)
            d3.select(this).classed("half", true)
            d3.select(this).classed("within", false)
          } else {
            d3.select(this).classed("outside", false)
            d3.select(this).classed("half", false)
            d3.select(this).classed("within", true)
          }
        });

        d3.select(this).classed("focus",true).classed("within",false).classed("half",false).classed("outside",false);

        vertline1.transition()
                  .duration(200)
                  .ease(d3.easeSin)
                  .attr("x1",xScale(d.LowRange))
                  .attr("x2",xScale(d.LowRange))
                  .attr("visibility","visible");
        vertline2.transition()
                  .duration(200)
                  .ease(d3.easeSin)
                  .attr("x1",xScale(d.HighRange))
                  .attr("x2",xScale(d.HighRange))
                  .attr("visibility","visible");

        d3.select("#name").text(d.Species);
        d3.select("#range").text("Hearing range: " + d.LowRange + "Hz to " + d.HighRange + "Hz");
        // d3.select("#pic").style("background-image","url('"+d.Picture+"')")
        d3.select("#pic").attr("src",d.Picture);
        d3.select("#description").text(d.Description);
    });


  d3.selectAll(".bars")
    .on("mouseover", function(){
      d3.select(this).style("cursor","pointer");
    });

}
