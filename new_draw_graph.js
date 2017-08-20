var draw = function(dataset) {
  var w = 1000;
  var h = 500;
  var padding = 30;
  var svg = d3.select("body")
              .append("svg")
              .attr("width",w)
              .attr("height",h);

  var xScale = d3.scaleLog()
                .domain([10,100000])
                .range([0,w-padding]);

  var yScale = d3.scaleBand()
                .domain(d3.range(dataset.length))
                .range([0,h-padding])
                .padding(0.3);

  var xAxis = d3.axisBottom(xScale)
                .tickFormat(10,"e")
  var yAxis = d3.axisLeft(yScale);

  svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
        .attr("x",function(d){return xScale(d.LowRange)})
        .attr("width",function(d){return xScale(d.HighRange-d.LowRange)})
        .attr("y",function(d,i){return yScale(i)})
        .attr("height",yScale.bandwidth());

  svg.append("g")
      .attr("class","axis")
      .attr("transform","translate(0," + (h - padding) + ")")
      .call(xAxis)

  svg.append("g")
    .attr("class","axis")
    .attr("transform","translate(" + padding + ",0)")
    .call(yAxis)
}
