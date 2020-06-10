import filterdata from "./filter.js";
import top10 from "./top10_movies.js";

var data;

d3.csv("./data/tmdb-movie-metadata/tmdb_5000_movies.csv").then(function(raw_data) {
    // Convert quantitative scales to floats

    data = raw_data.map(function(d) {
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
    });

    filterdata(data)
    top10.top10(data)
  });