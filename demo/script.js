// see: https://www.dashingd3js.com/d3js-axes
var svgContainer = d3.select("body").append("svg")
	.attr("width", 400)
	.attr("height", 100);


var axisScale = d3.scale.linear()
	.domain([0,100])
	.range([0,400]);

var xAxis = d3.svg.axis()
.scale(axisScale);

var xAxisGroup = svgContainer.append("g")
	.call(xAxis);