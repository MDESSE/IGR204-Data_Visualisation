/*
References :
- simple scatter plot : https://www.d3-graph-gallery.com/graph/scatter_basic.html
*/

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom,
    data_path = "../../data/movies_details.csv"

// append the svg object to the body of the page
var svg = d3.select("#scatter_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

rscale = d3.scaleLinear()
  .domain([0, 100])
  .range([1, 10]); 


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
    + "<b>Budget: </b>" + "$ "+Math.ceil(d.budget) / 10**6 +" M"+ "<br/>" 
    + "<b>Revenue: </b>" + "$ "+Math.ceil(d.revenue / 10**6)+" M")
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


 
d3.csv(data_path).then(function (raw_data) {
  // Convert quantitative scales to floats
  data = raw_data.map(function (d) {
    try {
      return {
        budget: parseFloat(d["budget"]),
        revenue: parseFloat(d["revenue"]),
        vote_average: parseFloat(d["vote_average"]),
        popularity: parseFloat(d["popularity"]),
        genre: eval(d["genres"])[0]['name'],
        name: d["original_title"],
        year: parseInt(d["release_date"].slice(0, 4))
      };
    } catch{
      return {
        budget: parseFloat(d["budget"]),
        revenue: parseFloat(d["revenue"]),
        vote_average: parseFloat(d["vote_average"]),
        popularity: parseFloat(d["popularity"]),
        genre: "unknown",
        name: d["original_title"],
        year: parseInt(d["release_date"].slice(0, 4))
      };
    }
  }); 

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 5 * 10**8])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 10**8])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cy", (d) => y(d.budget))
      .attr("cx", (d) => x(d.revenue))
      .attr("r", (d) => rscale(d.popularity))
      .style("fill", "#141AC9")
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

  

})






