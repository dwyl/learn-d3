var spaceCircles = [30, 70, 110];

var svgContainer = d3.select("body").append("svg")
	.attr("width", 200)
	.attr("height", 200);
	// .style("border","1px solid black");

var circles = svgContainer.selectAll("circle")
.data(spaceCircles)
.enter()
.append("circle");

var circleAttributes = circles
.attr("cx", function (d) { return d; })
.attr("cy", function (d) { return d; })
.attr("r", 20)
.style("fill", function(d){
	var returnColor;
	if (d===30){ returnColor = "green"; }
	if (d===70){ returnColor = "blue"; }
	if (d===110){ returnColor = "red";}
	return returnColor;
});