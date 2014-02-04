 var circleData = [
	{ "cx": 20, "cy": 20, "radius": 20, "color" : "green" },
	{ "cx": 70, "cy": 70, "radius": 20, "color" : "purple" }];

var svgContainer = d3.select("body").append("svg")
	.attr("width",200)
	.attr("height",200);

// add circles to the circleGroup
var circles = svgContainer.selectAll("circle")
	.data(circleData)
	.enter()
	.append("circle");

var circleAttributes = circles
	.attr("cx", function (d) { return d.cx; })
	.attr("cy", function (d) { return d.cy; })
	.attr("r", function (d) { return d.radius; })
	.style("fill", function (d) { return d.color; });

// Add the SVG Text Element to the svgContainer
var text = svgContainer.selectAll("text")
	.data(circleData)
	.enter()
	.append("text");

// Add SVG Text Element Attributes
var textLabels = text
	.attr("x", function(d) { return d.cx + 20; })
	.attr("y", function(d) { return d.cy + 5; })
	.text( function (d) { return "( " + d.cx + ", " + d.cy +" )"; })
	.attr("font-family", "sans-serif")
	.attr("font-size", "13px")
	.attr("fill", function (d) { return d.color; });