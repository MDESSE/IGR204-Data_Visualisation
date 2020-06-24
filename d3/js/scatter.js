
/*
References :
- simple scatter plot : https://www.d3-graph-gallery.com/graph/scatter_basic.html
- d3 scatter plot with bubbles : https://www.d3-graph-gallery.com/graph/bubble_tooltip.html
*/

// set the dimensions and margins of the graph

var d3 = require("d3")
// var d3chromatic = require("d3-scale-chromatic")

var xx = 20
var margin = {top: 10+xx, right: 30+xx, bottom: 30+xx, left: 60+xx},
    width = 1200, //- margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    data_path = "../tmdb_5000_movies.csv",
    x, 
    y,
    xAxis,
    yAxis,
    xaxislabel, 
    yaxislabel,
    mouseover, 
    mouseout;

// append the svg object to the body of the page
var svg = d3.select("#scatter_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

var rscale = d3.scaleLinear()
  .domain([0, 1000])
  .range([5, 50]);

// Add a scale for bubble color
var myColor = d3.scaleOrdinal()
  .domain(['Documentary', 'Drama', 'Fantasy', 'Mystery', 'Adventure',
  'Horror', 'Romance', 'War', 'Crime', 'Action', 'History',
  'Animation', 'Western', 'Comedy', 'Family', 'TV Movie',
  'Science Fiction', 'Foreign', 'Music', 'Thriller'])
  .range(d3.schemeSet2);

/*
// -1- Create a tooltip div that is hidden by default:
var tooltip = d3.select("#scatter_plot")
  .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "blue")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("color", "white")

// -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
var showTooltip = function (d) {
  tooltip
    .transition()
    .duration(200)
  tooltip
    .style("opacity", 0.8)
    .html("<b>Title: </b>" + d.name + "<br/>" 
    + "<b>Budget: </b>" + "$ "+Math.ceil(d.budget) / 10**6 +" M "+ "<br/>" 
    + "<b>Revenue: </b>" + "$ "+Math.ceil(d.revenue / 10**6)+" M " + "<br/>"
    + d.genre)
    .style("left", (d3.mouse(this)[0] + 30) + "px")
    .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var moveTooltip = function (d) {
  tooltip
    .style("left", (d3.mouse(this)[0] + 30) + "px")
    .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var hideTooltip = function (d) {
  tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
}
*/

mouseover = function(d){
  tooltip.transition()    
  .duration(200)    
  .style("opacity", 1);

  tooltip .html("<b>Title: </b>" + d.name + "<br/>" 
  + "<b>Budget: </b>" + "$ "+Math.ceil(d.budget) / 10**6 +" M "+ "<br/>" 
  + "<b>Revenue: </b>" + "$ "+Math.ceil(d.revenue / 10**6)+" M " + "<br/>"
  + d.genre)
  .style("left", (d3.event.pageX + 10) + "px")
  .style("top", (d3.event.pageY - 15) + "px")

  }

mouseout = function(d){
  tooltip.transition()    
  .duration(200)    
  .style("opacity", 0)
}

// create tooltips
var tooltip = d3.select("body")
    .append("div")  
    .style('position','absolute')
    .style("opacity", 0)
    .style("background-color", "lightsteelblue")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");



function scatter(data){
  //alert("connected")

  var i = "revenue"
  var j= "budget"
  // select topData based on i
  var topData = data.sort(function (a, b) {
    return d3.descending(+a[i], +b[i]);
  }).slice(0, 100);
 
  // Add X axis
  x = d3.scaleLinear()
    .domain([d3.min(topData, function(d) { return d[i] ;} ), d3.max(topData, function(d) { return d[i] ;} )])
    .range([0, width - margin.right - margin.left]);
  
  // Add Y axis
  y = d3.scaleLinear()
    .domain([d3.min(topData, function (d) { return d[j]; }), d3.max(topData, function (d) { return d[j]; })])
    .range([height, 0]);

 xAxis = svg.append("g")
 .call(d3.axisBottom(x))
 .attr("transform", "translate(0," + height + ")");

 yAxis = svg.append("g")
  .call(d3.axisLeft(y));
  
xaxislabel = svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", width - margin.right - margin.left)
  .attr("y", height + margin.top)
  .text(i);

yaxislabel = svg.append("text")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(0)")
  .attr("y", 0)
  .attr("x", -10)
  .text(j);

  // Add dots

  svg.append('g')
    .selectAll("dot")
    .data(topData)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cy", (d) => y(d[j]))
      .attr("cx", (d) => x(d[i]))
      .attr("r", (d) => rscale(d.popularity))
      .style("fill", "#141AC9")
      .style("fill", (d) => myColor(d.genre))
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);
    /*
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )
    */

  //d3.select("#X_axis_scatter").on("change", () => change(data));
  //d3.select("#Y_axis_scatter").on("change", () => change(data));

}

//create update function 

function change(data) {
  var selectValueX = d3.select('#X_axis_scatter').property('value');
  var selectValueY = d3.select('#Y_axis_scatter').property('value');

  var i = selectValueX
  var j= selectValueY

  var topData = data.sort(function (a, b) {
    return d3.descending(+a[i], +b[i]);
  }).slice(0, 100);

  // update x and y domain / scale       
  x.domain([d3.min(topData, function(d) { return d[i] ;} ), d3.max(topData, function(d) { return d[i] ;} )])
    .call(d3.axisLeft(x))

  y.domain([d3.min(topData, function (d) { return d[j]; }), d3.max(topData, function (d) { return d[j]; })])
    .call(d3.axisLeft(y))
    
  xAxis
    .transition()
    .duration(1500)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "middle");
  
  yAxis
  .transition()
  .duration(1500)
  .call(d3.axisLeft(y))
  .selectAll("text")
  .style("text-anchor", "middle");
  
  xaxislabel
    .attr("text-anchor", "middle")
    .text(selectValueX);

  yaxislabel
    .attr("text-anchor", "end")
    .text(selectValueY);
  
  var dots = d3.selectAll(".bubbles").data(topData)

  dots.exit().remove(); 

  dots.attr("cx", function(d) {return  x(d[i]);})
  //.attr("cy", (d) => y(d.budget))
      .attr("cy", function(d) {return  y(d[j]);})
      .attr("r", (d) => rscale(d.popularity))
      .style("fill", "#141AC9")
      .style("fill", (d) => myColor(d.genre))
}



module.exports.scatter = scatter;
module.exports.change = change;




