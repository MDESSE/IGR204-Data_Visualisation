var words = [];
var layout;
var wordsMap = {};

var d3 = require("d3"),
    cloud = require("d3-cloud");

function wordcloud(data){
  console.log(data)
  d3.csv("data/words.csv").then(function(raw_data){
  raw_data.map(function(d){
      if (wordsMap.hasOwnProperty(d.words)) {
        wordsMap[d.words]++;
      } else {
        wordsMap[d.words] = 1;
      }
  })
  for (const [key, value] of Object.entries(wordsMap)) {
    words.push({text: key, size: 10 + wordsMap[key] * 5})
  }
  layout = cloud()
    .size([700, 400])
    .words(words)
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 2) * 45; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw);

  layout.start();
})

function draw(words) {
  d3.select("#wordcloud").append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }
}

module.exports.wordcloud = wordcloud;
