var theData = [ 1, 2, 3 ];

var p = d3.select("body").selectAll("p")
.data(theData)
.enter()
.append("p")
.text( function (d,i) {	return "i = " + i + " d = "+d; } );