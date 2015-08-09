'use strict';

/* jshint globalstrict: true */
/* global d3,colorbrewer */

var width = 960,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .size([width, height]);

var svg = d3.select("#node-chart").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("twitter-nn.json", function(error, graph) {
  if (error) throw error;

  // Compute the distinct nodes from the links.
  graph.links.forEach(function(link) {
    link.source = graph.nodes[link.source];
    link.target = graph.nodes[link.target];
  });

  force
    .nodes(d3.values(graph.nodes))
    .links(graph.links)
    .linkDistance(function(d){
      return d.value;
    })
    .charge(-5)
    .start();

  var link = svg.selectAll(".link")
    .data(force.links())
    .enter().append("line")
    .attr("class", "link");

  var node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", function(d) {
        return d.count;
     })
    .on("mouseover", function(d) {
         d3.select(labels[0][d.index]).style("visibility", "visible");
     })
    .on("mouseout", function(d) {
         d3.select(labels[0][d.index]).style("visibility", "hidden");
     })
    .call(force.drag);

  var labels = node.append("title")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.title; })
    .style("visibility", "hidden");

  var r = 6;

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    node
      .attr("cx", function(d) { return d.x = Math.max(r, Math.min(width - r,  d.x)); })
      .attr("cy", function(d) { return d.y = Math.max(r, Math.min(height - r, d.y)); });
  });

});
