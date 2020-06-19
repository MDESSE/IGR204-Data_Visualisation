/*
References :
- simple scatter plot : https://www.d3-graph-gallery.com/graph/scatter_basic.html
- d3 scatter plot with bubbles : https://www.d3-graph-gallery.com/graph/bubble_tooltip.html
*/

// set the dimensions and margins of the graph
xx = 40
var margin = {top: 10+xx, right: 30+xx, bottom: 30+xx, left: 60+xx},
    width = 1200 //- margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    data_path = "../tmdb_5000_movies.csv"

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

// Add a scale for bubble color
var myColor = d3.scaleOrdinal()
  .domain(['Documentary', 'Drama', 'Fantasy', 'Mystery', 'Adventure',
  'Horror', 'Romance', 'War', 'Crime', 'Action', 'History',
  'Animation', 'Western', 'Comedy', 'Family', 'TV Movie',
  'Science Fiction', 'Foreign', 'Music', 'Thriller'])
  .range(d3.schemeSet2);


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
    + "<b>Revenue: </b>" + "$ "+Math.ceil(d.revenue / 10**6)+" M " + d.genre)
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

  i = "revenue"
  j= "budget"
  // select topData based on i
  var topData = data.sort(function (a, b) {
    return d3.descending(+a[i], +b[i]);
  }).slice(0, 100);
  

  // Add X axis
  var x = d3.scaleLinear()
    //.domain([0, 5 * 10**8])
    .domain([d3.min(topData, function(d) { return d[i] ;} ), d3.max(topData, function(d) { return d[i] ;} )])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 10) + ")")
    .style("text-anchor", "middle")
    .text(i);



  // Add Y axis
  var y = d3.scaleLinear()
  .domain([d3.min(topData, function(d) { return d[j] ;} ), d3.max(topData, function(d) { return d[j] ;} )])  
  //.domain([0, 10**8])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(j);  

  


  
    
  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(topData)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cy", (d) => y(d.budget))
      .attr("cx", (d) => x(d.revenue))
      .attr("r", (d) => rscale(d.popularity))
      .style("fill", "#141AC9")
      .style("fill", (d) => myColor(d.genre))
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

  //d3.select("#X_axis_selector").on("change", change);
  //d3.select("#Y_axis_selector").on("change", change);

})

//create update function 

function change() {
  selectValue = d3.select('select').property('value');

  if (this.selectedIndex == 0){ 
    i = "revenue";   
  } else if (this.selectedIndex == 1){
    i = "budget";
  } else if (this.selectedIndex == 2){
    i = "vote_average";
  } else if (this.selectedIndex == 3){
    i = "popularity";
    }



  // update x and y domain / scale       
  x
  .domain([0, d3.max(topData, function(d) { return d[i] ;} )])
  .call(d3.axisBottom(x));
    
  y
  .domain(data.map(function(d) { return d.name; }))
  .call(d3.axisLeft(y));
    

  // Update x axis label   (y axis remains unchanged)
  xaxislabel
  .attr("text-anchor", "end")
  .text(i);
  
  
  // Update the Y-axis and X-axis
  yAxis
  .transition()
  .duration(1500)
  .call(d3.axisLeft(y));
  
  xAxis
  .transition()
  .duration(1500)
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-20)")
  .style("text-anchor", "end");


  // Update data:
  svg.selectAll(".circle")
  .data(data)
  .transition()
  .duration(2000)
  .attr("class", "bar")
  .attr("x",  function(d) {return  x(0);})
  .attr("y", function(d) { return y(d.name); })
  .attr("width",function(d){return x(0);} )
  .attr("width",function(d) { return  x(d[i]);}  )
  .attr("height", 15);

  }






