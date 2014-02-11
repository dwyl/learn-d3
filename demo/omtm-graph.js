
function getMaxObjectValue(this_array, element) {
	var values = [];
	for (var i = 0; i < this_array.length; i++) {
			values.push(Math.ceil(parseFloat(this_array[i][""+element])));
	}
	values.sort(function(a,b){return a-b});
	return values[values.length-1];
}

function getMinObjectValue(this_array, element) {
	var values = [];
	for (var i = 0; i < this_array.length; i++) {
			values.push(Math.floor(parseFloat(this_array[i][""+element])));
	}
	values.sort(function(a,b){return a-b});
	return values[0];
}


$(document).ready(function() {
	var dateRange = [],   // used to draw the axis below
		aapd = {};        // average achievements per day

	// To derive our co-ordinate data we will get data from MySQL in form of:
	// learnersbydate.json MySQL example:
	// [["2014-01-23",32],["2014-01-28",1],["2014-01-31",3],["2014-02-02",2]]
	// PostgreSQL example:
	// [{"date":"2014-02-10","count":"73"}]
	$.get("learnersbydate.json", function(lbd) {

		var date, count, startDate;
		console.log(lbd[0])
		
		if(typeof lbd[0][0] === "undefined"){
			if(lbd.length > 1) {
				startDate = lbd[lbd.length-1]["date"];
			}

		} else {
			startDate = lbd[0][0];
		}
		// console.log("startDate >> ",startDate);
		// first date in the learnersbydate.json is date first user was created
		// since there is no activity without users we derive our dateRange
		// from the first user creation date.
		dateRange = DU.dateRange(startDate);
		// console.log(dateRange);
		// loop through all the
		var j = 0, i = 0, learnerCount = 0,
		learnersByDate = {};
		// Next we Create an object of Cumulative users for each date in the range
		// ( Rather complicating the SQL Query I derive from the raw data )
		while(i < dateRange.length) {
			if(dateRange[i] === lbd[j]["date"]) {
				learnerCount = learnerCount + parseInt(lbd[j]["count"], 10);
				if(j < lbd.length -1){
					j = j + 1;
				}
			}
			learnersByDate[dateRange[i]] = learnerCount;
			// console.log(dateRange[i] +" : " +learnerCount )
			i = i + 1;
		};
		// console.log(learnersByDate);
			// achievementsbydate.json MySQL example:
			// [["2014-01-23",4],["2014-01-24",8],["2014-01-27",8],["2014-01-28",1],
			// ["2014-01-29",3],["2014-02-03",10],["2014-02-04",1],["2014-02-05",2]]
			// PostgreSQL example: (notice date is decending)
			// [{"date":"2014-02-11","count":"11"},{"date":"2014-02-10","count":"2"}]

			$.get("achievementsbydate.json", function(abd) {
				var i = 0, j = 0, aa = 0, // average achivements
				aDate; // achievementDate
				while(i < dateRange.length) {
					aDate  = abd[j]["date"] || abd[j][0];
					aCount = parseInt(abd[j]["count"], 10) || parseInt(abd[j][1], 10);
					// console.log("aDate : "+aDate +" | aCount : "+aCount);
					if(dateRange[i] === aDate) {
					// using the learnersbydate data above:
					// usersPerDate = { "2014-01-23":32, "2014-01-24":32, "2014-01-25":32, 
					// "2014-01-26":32, "2014-01-27":32, "2014-01-28":33, "2014-01-29":33, 
					// "2014-01-30":33, "2014-01-31":36, "2014-02-01":36, "2014-02-02":38 };
					aa =  aCount / parseInt(learnersByDate[dateRange[i]], 10);
					if(j < abd.length -1){
						j = j + 1;
					}
				} else {
					aa = 0;
				}
				aapd[dateRange[i]] = aa;
				// console.log(dateRange[i] +" : " +aa )
				i = i + 1;
				}
				console.log(aapd);

	  		renderGraph();
		});
	});

// Our end result is a graph like this:
//  __________________________
//  | # activities per user  |
//  | 3|     .   .           |
//  | 2|	   .             |
//  | 1| .         .         |
//  | 0|___._________._      | 
//  |    M T W T F S S  Date |
//  |________________________|
//
// Y-axis: Activities per user per day
// X-axis: Date MM/DD

	function renderGraph(){

		var data = [];  								
		var startingDate =  DU.parseDate(dateRange[0]); // new Date(2012, 8, 18);		
		// this is a date object. each of our data objects is attached to a date
		for (var i = 0; i < dateRange.length; i++) {					
		// loop 10 times to create 10 data objects
			var tmpObj 	= {};							
				// this is a temporary data object
			tmpObj.date = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate()+i);				
			// the data for this data object. Increment it from the starting date.
			tmpObj.DAU 	= aapd[dateRange[i]];  			
				// random value. Round it to a whole number.
			data.push(tmpObj); 							
				// push the object into our data array
		}


		var width = document.documentElement.clientWidth - 70, height = 400;
		var margin = {top: 30, right: 10, bottom: 50, left: 60}, width = width - margin.left - margin.right, height = height - margin.top - margin.bottom;
		// these are graph size settings

		var minDate = (data[0].date),
		maxDate = data[data.length-1].date;
		minObjectValue = getMinObjectValue(data, 'DAU');
		maxObjectValue = getMaxObjectValue(data, 'DAU');

		//create the graph object
		document.getElementById("metrics").innerHTML = ''; // clear to re-draw
		var vis= d3.select("#metrics").append("svg")
	    	.data(data)
			.attr("class", "metrics-container")
	   		.attr("width", width + margin.left + margin.right)
	    	.attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var y = d3.scale.linear().domain([ minObjectValue - (.1 * minObjectValue) , maxObjectValue + (.1 * maxObjectValue) ]).range([height, 0]),
		x = d3.time.scale().domain([minDate, maxDate]).range([0, width]);

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(5);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(dateRange.length-1);

		vis.append("g")
		    .attr("class", "axis")
		    .call(yAxis);

		vis.append("g")
			.attr("class", "axis x-axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis);

		//add the axes labels
		vis.append("text")
		    .attr("class", "axis-label")
		    .attr("text-anchor", "end")
		    .attr("x", document.documentElement.clientWidth - 150)
		    .attr("y", height + -134)
		    .text('');

		vis.append("text")
		    .attr("class", "axis-label")
		    .attr("text-anchor", "end")
		    .attr("y", 6)
		    .attr("dy", "-3.4em")
		    .attr("transform", "rotate(-90)")
		    .text('# Average Activities Logged Per Learner');

		var line = d3.svg.line()
			.x(function(d) { return x(d["date"]); })
			.y(function(d) { return y(d["DAU"]); })

		vis.append("svg:path")
			.attr("d", line(data))
			.style("stroke", function() { 
				return "#333";
			})
			.style("fill", "none")
			.style("stroke-width", "2.5");

			var dataCirclesGroup = vis.append('svg:g');

			var circles = dataCirclesGroup.selectAll('.data-point')
				.data(data);

			circles
				.enter()
				.append('svg:circle')
				.attr('class', 'dot')
				.attr('fill', function() { return "#809E35"; })
				.attr('cx', function(d) { return x(d["date"]); })
				.attr('cy', function(d) { return y(d["DAU"]); })
				.attr('r', function() { return 4; });

			// rotate x-axis labels by -90 degrees to fit more in.
			vis.selectAll(".x-axis text")
	      	.attr("transform", function(d) { return "translate(" + -10 + ", " + 30 + ") rotate(-90)" });
	}

	$( window ).resize(function() {
	  renderGraph();
	});
}); //  end $(document).ready()
