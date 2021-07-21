var svgWidth = 960;
var svgHeight = 625;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter") // insert chart to tag id "scatter"
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g") 
  .attr("height", height)
  .attr("width", width)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
    

// initial params
var xProperty = "poverty";
var yProperty = "healthcare";

  // updating x-scale 
function xScale(data, xProperty) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[xProperty]) * 0.8,
    d3.max(data, d => d[xProperty]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating x-scale var upon click on axis label
function yScale(data, yProperty) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[yProperty]) * 0.8,
    d3.max(data, d => d[yProperty]) * 1.1
    ])
    .range([height, 0]);

  return yLinearScale;
}

// for updating xAxis var upon click on X axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
  // for updating xAxis var upon click on Y axis label
function renderyAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale); 
  yAxis.transition()
    .duration(500)
    .call(leftAxis);

  return yAxis;
}
// function for updating circles group
function renderCircles(circlesGroup, newXScale, xProperty, newYScale, yProperty) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[xProperty]))
    .attr("cy", d => newYScale(d[yProperty]));
  return circlesGroup;
}
//circleText
function renderText(circleText, newXScale, xProperty, newYScale, yProperty) {
  circleText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[xProperty]))
    .attr("y", d => newYScale(d[yProperty]));
  return circleText;
}


  // Import Data
  d3.csv("assets/data/data.csv").then(function (data) {

  // parse data/cast as numbers
  data.forEach(d => {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
});

  // xLinearScale function 
  var xLinearScale = xScale(data, xProperty);
  var yLinearScale = yScale(data, yProperty);
 
  // Create bottom(x) and left(y) axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append axes to chart
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  chartGroup.append("g")
    .call(leftAxis); 

  // create Circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[xProperty])) 
    .attr("cy", d => yLinearScale(d[yProperty])) 
    .attr("r", "15") 
    .attr("class", "stateCircle") 
    .attr("opacity", ".7");


  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

 
  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("value", "poverty")
    .classed("active", true)
    .text("Poverty");

  
    var healthcareLabel = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -20))
    .attr("value", "healthcare") 
    .classed("inactive", true)
    .text("Healthcare");  


  //  add text to Circle
  var circleText = chartGroup.selectAll()
    .data(data)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[xProperty])) 
    .attr("y", d => yLinearScale(d[yProperty])) 
    .attr("class", "stateText") 
    .attr("font-size", "9");
 
}).catch(function (error) {
  console.log(error);
});


