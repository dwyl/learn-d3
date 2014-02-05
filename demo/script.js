// see: https://www.dashingd3js.com/d3js-axes
var svgContainer = d3.select("body").append("svg")
	.attr("width", 800)
	.attr("height", 200);


var axisScale = d3.scale.linear()
	.domain([0,100])
	.range([0,770]);

var xAxis = d3.svg.axis()
.scale(axisScale);

var xAxisGroup = svgContainer.append("g")
	.call(xAxis).attr("transform", "translate(10,170)");