var d3 = require('d3');
var ReactFauxDom = require('react-faux-dom');
console.log(d3);
var graphs = React.createClass({

	componentDidMount: function() {
	},
    render: function() {

		var width = window.innerWidth * .9,
		height = window.innerHeight * .9,
		outerRadius = Math.min(width, height) * .5 - 10,
    	innerRadius = outerRadius * .6;

		var node = ReactFauxDom.createElement('svg');
		var svg = d3.select(node);
		svg
			.attr("class", "donut")
			.attr("width", width)
			.attr("height", height)

		var noun = {type: "noun", count:0, color:"#0055A4", text:"noun"},
	    adj = {type: "adj", count:0, color:"#0E6B5C", text:"adjective"},
	    verb = {type: "verb", count:0, color:"#EF4135", text:"verb"},
	    adv = {type: "adv", count:0, color:"#63005F", text:"adverb"},
	    pron = {type: "pron", count:0, color:"#BF5700", text:"pronoun"},
	    conj = {type: "conj", count:0, color:"#808080", text:"conjunction"};  

		for (var i = 0; i < this.props.data.length; i++) {
			var partOfSpeech = this.props.data[i].partsOfSpeech[0].pos;
			switch (partOfSpeech) {
				case "noun": 
				   noun.count++;
				   break;
				case "adj":
				   adj.count++;
				   break;
				case "verb":
				   verb.count++;
				   break;
				case "adv":
				   adv.count++;
				   break;
				case "pron personnel":
				   pron.count++;
				   break;
				case "pron":
					pron.count++;
					break;
				case "conj":
				   conj.count++;
				   break;
			} 
		}

		var n = 6,
	    data = [noun, adj, verb, adv, pron, conj]
		var color = d3.scale.category20();

		var arc = d3.svg.arc();

		var pie = d3.layout.pie()
		    .sort(null);	

		var tooltip = d3.select("#tooltip");

		svg.selectAll(".arc")
		    .data(arcs(data))
		  .enter().append("g")
		    .attr("class", "arc")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		  .append("path")
		    .attr("fill", function(d, i) { return d.color; })
		    .attr("d", arc)
		  .on("click", function(d) {
		  	transition(d, 1);
		  	console.log(d3.event);
            tooltip.transition()
	           .duration(200)
	           .style("opacity", .9)
	           .style("display", 'initial')
	           tooltip.html(d.count > 1 ? d.count + " " + d.text + "s stored" : d.count + " " + d.text + " stored")
	           .style("left", (d3.event.layerX) + 'px')
	           .style("top", (d3.event.clientY) + 'px')		  
		  })
		  .on("mouseout", function(d) {
	      	tooltip.transition()
	      		.duration(500)
	      		.style("opacity", 0)
		  })
		  .on("mouseover", function() {

		  })

		function arcs(data) {
			var values = [];
			for (var i = 0; i < data.length; i++) {
				values.push(data[i].count);
			}
		  var arcs = pie(values),
		      i = -1,
		      arc;
		  while (++i < n) {
		    arc = arcs[i];
		    arc.innerRadius = innerRadius;
		    arc.outerRadius = outerRadius;
		    arc.type = data[i].type;
		    arc.count = data[i].count;
		    arc.color = data[i].color;
		    arc.text = data[i].text;
		  }
		  return arcs;
		}

		function transition(selected, state) {
		  var path = d3.selectAll(".arc > path");
		      path.data(arcs(data));

		  // Wedges split into two rings.
		  var t0 = path.transition()
		      .duration(500)
		      .attrTween("d", tweenArc(selected, function(d, i) {
		        return {
		          innerRadius: (innerRadius + outerRadius) / 2,
		          outerRadius: outerRadius  * .9
		        };
		      }));

		  // Wedges then update their values, changing size.
		  var t1 = t0.transition()
		  		.duration(500)
		        .attrTween("d", tweenArc(selected, function(d, i) {

		          return {
		            startAngle: d.startAngle,
		            endAngle: d.endAngle
		          };
		        }));
		}

		function tweenArc(selected, b) {
		  return function(a, i) {
		  	if (a.type == selected.type) {
		  		i = d3.interpolate(a, a);
		  	}
		  	else {
			    var d = b.call(this, a, i),
			    i = d3.interpolate(a, d);

			    for (var k in d) {
			    	a[k] = d[k]; // update data

			    }
		  	}
		    return function(t) { return arc(i(t)); };
		  };
		}

		return node.toReact();

    }
})
module.exports = graphs;