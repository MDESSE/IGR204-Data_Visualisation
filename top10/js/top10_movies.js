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
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



//tooltip displaying the relevant information when the user hovers or unhovers on an item
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

    //./data/tmdb-movie-metadata/tmdb_5000_movies.csv
    d3.csv("/data/tmdb_5000_movies.csv")
        .row( (d,i) =>{    
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
    //load the data
    .get(function(error,rows) {
        // output some debugging information to the console, so we can make sure everything is loading correctly
        console.log("Loaded " + rows.length + " rows");
         if (rows.length >0) {
             console.log("First row: ", rows[0])
             console.log("Last row: ", rows[rows.length-1])
             }
        

        // //compute the scales when the data is finished loading
        // x = d3.scaleLinear()
        // .domain(d3.extent(rows,(row) => row.longitude))
        // .range([30,w-30]);
        
        // y = d3.scaleLinear()
        // .domain(d3.extent(rows,(row) => row.latitude))
        // .range([h-30,30]);
        
        // r = d3.scaleLinear()
        // .domain(d3.extent(rows, (row) => row.population))
        // .range([0, 40])

        // r1 = d3.scaleLinear()
        // .domain([0,400])
        // .range(['#a598be', '#381085'])

        
        //the rows parameter to our get() method has the data, so we just need to save it somewhere accessible from the rest of our progream
        data = rows
        
        

    });

    

    d3.select("#label-option").on("change", change)


    var topData = data.sort(function(a, b) {
        return d3.descending(+a.revenue, +b.revenue);
        }).slice(0, 20);

    var i = "revenue"

    draw(topData,i);


    function change() {
        i = "revenue";

        topData = data.sort(function(a, b) {
        return d3.descending(+a.revenue, +b.revenue);
        }).slice(0, 20);

        //selectValue = d3.select('select').property('value')
        

      if (this.selectedIndex == 1){
        topData = data.sort(function(a, b) {
        return d3.descending(+a.budget, +b.budget);
        }).slice(0, 20);

        //selectValue = d3.select('select').property('value')
        i = "budget";
        
        draw(topData,i);
    
      } else if (this.selectedIndex == 2){
        topData = data.sort(function(a, b) {
            return d3.descending(+a.vote_average, +b.vote_average);
        }).slice(0, 20);

        //selectValue = d3.select('select').property('value')
        i = "vote_average";

        draw(topData,i);
        
      } else if (this.selectedIndex == 3){
        topData = data.sort(function(a, b) {
            return d3.descending(+a.popularity, +b.popularity);
        }).slice(0, 20);
        
        //selectValue = d3.select('select').property('value')
        i = "popularity";
        

        
        draw(topData,i);
        }
        
        console.log(topData);
        console.log(selectValue);
    };

    function draw(topData,i) {
       
       
        selectValue = d3.select('select').property('value')
        
        d3.select("#label-option").on("change", change)

       
        // var topData = data.sort(function(a, b) {
        //      return d3.descending(+a.revenue, +b.revenue);
        //  }).slice(0, 20);

            // Add X axis
        var x = d3.scaleLinear()
        .domain([0, d3.max(topData, function(d) { return d[i] ;} )])
        .range([ 0, width]);

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-20)")
        .style("text-anchor", "end");

        // Y axis
        var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(topData.map(function(d) { return d.name; }))
        .padding(1);

        svg.append("g")
        .call(d3.axisLeft(y))

        svg.selectAll(".bar")
        .data(topData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x",  function(d) {return  x(0);})
        .attr("y", function(d) { return y(d.name); })
        // no bar at the beginning thus:
        .attr("width",function(d){return x(0);} )
        .attr("height", 15)
        .on("mouseover", mouseover )
        .on("mouseout", mouseout);

        // removed data:
        svg.selectAll(".bar").exit().remove();
        svg.selectAll("text").exit().remove();

        var bar = svg.selectAll(".bar")
        .data(topData, function(d) {
          return d.name
        })


        // updated data:
        svg.selectAll(".bar")
        .transition()
        .duration(2000)
        //.attr("x", function(d) { return x(d.revenue); })
        .attr("y", function(d) { return y(d.name); })
        .attr("width",function(d) { return  x(d[i]);}  )
        .attr("height", 15);

        //   // ENTER -- ADD ITEMS THAT ARE NEW IN DATA
        // bar.enter().append("g")
        // .attr("transform", function(d) {return "translate(" + y(d.name) + ",0)";})
        // .attr("class", 'bar')
        // .append("rect")
        // .attr("x", function(d) {return x(0);})                            //https://stackoverflow.com/questions/45579350/d3-how-to-update-the-chart-after-selection-from-drop-down-menu-with-new-data
        // .attr("width", function(d) { return  x(d[i]);})
        // .attr("height",15)  

        // // UPDATE EXISTING ITEMS
        // svg.selectAll(".bar")
        // .transition(100)
        // .attr("transform", function(d) {return "translate(" + y(d.name) + ",0)"})
        // .select('rect')
        // .attr("x", function(d) {return x(0);}) 
        // .attr("height", function(d) { return  x(d[i]);})
        // .attr("height",15)  

        // // REMOVE ITEMS DELETED FROM DATA
        // bar.exit().remove()

        // // Lines
        // svg.selectAll("myline")
        // .data(topData)
        // .enter()
        // .append("line")
        // .attr("x1", x(0))
        // .attr("x2", x(0))
        // .attr("y1", function(d) { return y(d.name); })
        // .attr("y2", function(d) { return y(d.name); })
        // .attr("stroke", "grey")

        // // Circles -> start at X=0
        // svg.selectAll("mycircle")
        // .data(topData)
        // .enter()
        // .append("circle")
        // .attr("cx", x(0) )
        // .attr("cy", function(d) { return y(d.name); })
        // .attr("r", "7")
        // .style("fill", "#69b3a2")
        // .attr("stroke", "black")

        // // Change the X coordinates of line and circle
        // svg.selectAll("circle")
        // .transition()
        // .duration(2000)
        // .attr("cx", function(d) { return x(d.revenue); })

        // svg.selectAll("line")
        // .transition()
        // .duration(2000)
        // .attr("x1", function(d) { return x(d.revenue); })


    };

    var mouseover = function(d){

        tooltip.transition()		
            .duration(200)		
            .style("opacity", 1);

        tooltip .html("name: " + d.name + "<br/>" + i + " : " + d[i])
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px");
    }

    var mouseout = function(d){
        
    
        tooltip.transition()		
            .duration(200)		
            .style("opacity", 0)
            
        }


    //mouseover and mouseout function

    //to add tooltip
    //https://jkeohan.wordpress.com/2015/03/09/using-d3-tooltips/
    //https://bl.ocks.org/d3noob/a22c42db65eb00d4e369  
    //https://www.d3-graph-gallery.com/graph/scatter_tooltip.html

    //to add title
    //http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html

    // for the html color
    //https://htmlcolorcodes.com/