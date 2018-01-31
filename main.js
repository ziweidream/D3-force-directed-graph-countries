function getData(getDataCallBack) {
  $.getJSON('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json', function(data) {
    var data = data;
    getDataCallBack(data);
  });
}

f = function(data) {
  // width and height
  var w = 1000;
  var h = 600;
  //extract nodes
  var nodes = data.nodes;
  //create SVG element
  var svg = d3.select("#root").append("svg").attr("width", w).attr("height", h);
  d3.select("#root").attr("align", "center");
  svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "black").attr("opacity", "1");
  //create flags - the method used to create flags here was inspired by a post on stackoverflow on 31 Jan, 2018:
  //https://stackoverflow.com/questions/39128245/adding-foreignobjects-to-d3-force-directed-graph-nodes-breaks-events
  var defs = svg.append("defs").selectAll("pattern").data(icons).enter().append("pattern").attr("width", 16).attr("height", 11).attr("id", function(d) {
    return "p_" + d.name;
  })
  defs.append("image").attr("xlink:href", "http://res.cloudinary.com/dbsgnowkn/image/upload/v1517433389/flags_bwzrjx.png").attr("x", function(d) {
    return -d.x;
  }).attr("y", function(d) {
    return -d.y;
  }).attr("width", "256").attr("height", "176");
  //create a force directed graph
  var force = d3.layout.force().gravity(0.05).distance(100).charge(-100).size([w, h]);
  force.nodes(nodes).links(data.links).start();
  var link = svg.selectAll(".link").data(data.links).enter().append("line").attr("class", "link");
  var node = svg.selectAll(".node").data(nodes).enter().append("g").attr("class", "node").call(force.drag);
  //use flags as nodes
  node.append("rect").attr("width", 16).attr("height", 11).style("stroke", "none").attr("fill", function(d) {
    return "url(#p_" + d.code + ")";
  });
  //display country name
  node.append("title").text(function(d) {
    return d.country;
  });

  force.on("tick", function() {
    link.attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    });
    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });
}

getData(f);
