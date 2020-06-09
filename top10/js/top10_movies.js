// MS BGD 2019-2020 - HIROTO YAMAKAWA 

let data =[];

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#hiro_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

////////////////////////////////////////////////////////////////////////////////////////////////

// create variables
var x = d3.scaleLinear()
.range([ 0, width]);

var y = d3.scaleBand()
.range([ 0, height ])
.padding(1);

// create labels
var yaxislabel =svg.append("text")
.attr("text-anchor", "end")
.attr("transform", "rotate(0)")
.attr("y", 0)
.attr("x", -15);        

var xaxislabel = svg.append("text")
.attr("text-anchor", "end")
.attr("x", width)
.attr("y", height + margin.top + 20);
    
// create axis
var xAxis = svg.append("g")
.call(d3.axisLeft(x))
.attr("transform", "translate(0," + height + ")");

var yAxis = svg.append("g")
.call(d3.axisLeft(y));

// set i to "revenue" (default choice)
var i = "revenue"

// create mouseover and mouseout functions
var mouseover = function(d){
  tooltip.transition()		
  .duration(200)		
  .style("opacity", 1);

  tooltip .html("name: " + d.name + "<br/>" + i + " : " + d[i] + "<br/>" + "genre : "+ d.genre)
  .style("left", (d3.event.pageX + 10) + "px")
  .style("top", (d3.event.pageY - 15) + "px")

  }

var mouseout = function(d){
  tooltip.transition()		
  .duration(200)		
  .style("opacity", 0)
}

// create tooltips
var tooltip = d3.select("body")
    .append("div")  
    .attr("class", "tooltip")
    .style('position','absolute')
    .style("opacity", 0)
    .style("background-color", "lightsteelblue")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");
  

////////////////////////////////////////////////////////////////////////////////////////////////


 //./data/tmdb-movie-metadata/tmdb_5000_movies.csv
d3.csv("/data/tmdb_5000_movies.csv").then(function(raw_data) {
  
  data = raw_data.map(function(d) { 
    // Convert quantitative scales to floats
      try{
        return {
          budget: parseFloat(d["budget"]), 
          revenue: parseFloat(d["revenue"]), 
          vote_average: parseFloat(d["vote_average"]), 
          popularity: parseFloat(d["popularity"]),
          genre: eval(d["genres"])[0]['name'],
          name: d["original_title"],
          year: parseInt(d["release_date"].slice(0, 4))
        };
      }catch{
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
    })

    //initiate graph
    initialGraph(data);

    //update graph based on selection from HTML dragdown
    d3.select("#label-option").on("change", change);
  });


////////////////////////////////////////////////////////////////////////////////////////////////

// create function initialGraph
function initialGraph(data){

  selectValue = d3.select('select').property('value')

  i = "revenue"

  // select topData based on i
  var topData = data.sort(function(a, b) {
    return d3.descending(+a[i], +b[i]);
    }).slice(0, 20);

  // rescale the domain
  x.domain([0, d3.max(topData, function(d) { return d[i] ;} )]);
  y.domain(topData.map(function(d) { return d.name; }));

  
  //initiate X axis
  xAxis
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-20)")
  .style("text-anchor", "end");

  //initiate Y axis
  yAxis
  .call(d3.axisLeft(y));


  //initiate X axis label
  xaxislabel.text(i);

  //initiate Y axis label
  yaxislabel.text("movies");

  //initiate bars, all starting at 0 at the beginning
  svg.selectAll(".bar")
  .data(topData)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x",  function(d) {return  x(0);})
  .attr("y", function(d) { return y(d.name); })
  .attr("width",function(d){return x(0);} )
  .attr("height", 15)
  .on("mouseover", mouseover )
  .on("mouseout", mouseout);


  //update the bar with the transition
  svg.selectAll(".bar")
  .transition()
  .duration(2000)
  .attr("width",function(d) { return  x(d[i]);}  )
  .attr("y", function(d) { return y(d.name); })
  .attr("height", 15);

};
////////////////////////////////////////////////////////////////////////////////////////////////


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

  
  //update topData
  topData = data.sort(function(a, b) {
    return d3.descending(+a[i], +b[i]);
  }).slice(0, 20);


  // update x and y domain / scale       
  x
  .domain([0, d3.max(topData, function(d) { return d[i] ;} )])
  .call(d3.axisBottom(x));
    
  y
  .domain(topData.map(function(d) { return d.name; }))
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
  svg.selectAll(".bar")
  .data(topData)
  .transition()
  .duration(2000)
  .attr("class", "bar")
  .attr("x",  function(d) {return  x(0);})
  .attr("y", function(d) { return y(d.name); })
  .attr("width",function(d){return x(0);} )
  .attr("width",function(d) { return  x(d[i]);}  )
  .attr("height", 15);


  }

  
       
