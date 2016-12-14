var d3 = require('d3');
var ReactFauxDom = require('react-faux-dom');
console.log(d3);
var bubble = React.createClass({
	render: function() {

		var node = ReactFauxDom.createElement('svg');
		var svg = d3.select(node);


		var adj = {type: 'adj', color: d3.rgb('#0E6B5C')}
		var noun = {type: 'noun', color: d3.rgb('#0055A4')}
		var pronompersonnel = {type: 'pron personnel', color: d3.rgb('#BF5700')}
		var pron = {type: 'pron', color: d3.rgb('#BF5700')}
		var conj = {type:'conj', color: d3.rgb('#808080')}
		var adv = {type: 'adv', color: d3.rgb('#63005F')}
		var verb = {type: 'verb', color: d3.rgb('#EF4135')}
		var colors = [adjectif, nom, pronom, pronompersonnel, conjonction, adverbe, verbe];


		var width = window.innerWidth;
		var height = window.innerHeight;
		var format = d3.format(",d"),
		// color = d3.scale.category20c();

		var bubble = d3.layout.pack()
		    .sort(null)
		    .size([width, height])
		    .padding(1.5);

		svg
			.attr("class", "bubble")
			.attr("width", width)
			.attr("height", height)
		return node.toReact();	
	}
});
// .directive('bubble', function() {
// 	return {
// 		restrict: 'A',
// 		link: function (scope, element, attributes) {
// 			scope.$watch("bucket", function (newValue, oldValue) {

// 				if (newValue != undefined) {
// 					var bucket = [];
// 					for (var i = 0; i < newValue.length; i++) {
// 						newValue[i].partsOfSpeech.map(function(item) {
// 							item.numberOfQueries = newValue[i].numberOfQueries;
// 							return item;
// 						})
// 						bucket = bucket.concat(newValue[i].partsOfSpeech);
// 					}
// 				var adjectif = {type: 'adj', color: d3.rgb('#0E6B5C')}
// 				var nom = {type: 'noun', color: d3.rgb('#0055A4')}
// 				var pronompersonnel = {type: 'pron personnel', color: d3.rgb('#BF5700')}
// 				var pronom = {type: 'pron', color: d3.rgb('#BF5700')}
// 				var conjonction = {type:'conj', color: d3.rgb('#808080')}
// 				var adverbe = {type: 'adv', color: d3.rgb('#63005F')}
// 				var verbe = {type: 'verb', color: d3.rgb('#EF4135')}
// 				var colors = [adjectif, nom, pronom, pronompersonnel, conjonction, adverbe, verbe];

// 					// var width = window.innerWidth < 768 ? window.innerWidth / 2 : 800,
// 						// height = window.innerWidth < 768 ? window.innerHeight / 2 : 800,
// 						var width = window.innerWidth;
// 						var height = window.innerHeight;
// 					    format = d3.format(",d"),
// 					    color = d3.scale.category20c();

// 					var bubble = d3.layout.pack()
// 					    .sort(null)
// 					    .size([width, height])
// 					    .padding(1.5);

// 					var svg = d3.select("#bubble").append("svg")
// 					    .attr("width", width)
// 					    .attr("height", height)
// 					    .attr("class", "graph");

// 					var totalNumberOfQueries = 0;
// 					for (var i = 0; i < bucket.length; i++) {
// 						totalNumberOfQueries += bucket[i].numberOfQueries;
// 					}

// 					var div = d3.select("#bubble").append("div")
// 						.attr("class", "tooltip")
// 						.style("opacity", 0)
// 						.style("display", "none")

// 					  var node = svg.selectAll(".node")
// 					      .data(bubble.nodes(classes(bucket))
// 					      .filter(function(d) { return !d.children; }))
// 					    .enter().append("g")
// 					      .attr("class", "node")
// 					      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

// 					       .on("click", function(d) {
// 					       	console.log(d3.event);
// 					      	div.transition()
// 					      		.duration(200)
// 					      		.style("opacity", .9)
// 					      		.style("display", 'initial')
// 					      		div.html("number of times queried: " + d.numberOfQueries)
// 					      		.style("left", (d3.event.layerX) + 'px')
// 					      		.style("top", (d3.event.clientY) + 'px')
// 					      })
// 					      .on("mouseout", function(d) {
// 					      	div.transition()
// 					      		.duration(500)
// 					      		.style("opacity", 0)
// 					      })

// 					  node.append("circle")
// 					      .attr("r", function(d) { return d.r; })
// 					      .style("fill", function(d) { 
// 					      	var color;
// 					      	for (var i = 0; i < colors.length; i++) {
// 					      		if (colors[i].type == d.className) {
// 					      			color = colors[i].color;
// 					      		}
// 					      	}
// 					      	return color;
// 					       });

// 					  node.append("text")
// 					      .attr("dy", ".3em")
// 					      .style("text-anchor", "middle")
// 					      .text(function(d) { return d.wordName.substring(0, d.r / 3); });

// 					// Returns a flattened hierarchy containing all leaf nodes under the root.
// 					function classes(root) {
// 					  var classes = [];

// 					  // function recurse(name, node) {
// 					  	for (var i = 0; i < root.length; i++) {
// 					  		classes.push({className: root[i].pos, wordName: root[i].term, numberOfQueries: root[i].numberOfQueries, value: root[i].numberOfQueries/totalNumberOfQueries * width})					  		
// 					  	}

// 					  return {children: classes};
// 					}

// 					d3.select(self.frameElement).style("height", height + "px");
// 				}
// 			});			
// 		}
// 	}
// })