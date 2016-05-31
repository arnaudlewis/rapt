var cheerio = require('cheerio');
var Time = require('../models/Time');
var Connection = require('../models/Connection');
var Transport = require('../models/Transport');
var Response = require('../models/Response');


var TIME_REGEX = new RegExp("^(([0-9]{1,2})[\\s][A-Za-z]+[\\s])?([0-9]{1,2})([\\s][A-Za-z]+)?$");
var DIRECTION_REGEX = new RegExp("^Direction[\\s](.+)$");
var LINE_REGEX = new RegExp("^Ligne[\\s](.+)$");

module.exports = {

  execute : function(html) {
   //s console.log(cheerio.load(html));
    var domTree = cheerio.load(html)
    return this.buildResponse(domTree, html);
  },

  buildResponse: function (domTree, html) {
    console.log(domTree);
    return new Response(this.getDuration(domTree, html), this.getWalkDuration(domTree), this.getConnections(domTree), this.getNbConnections(domTree));
  },

  createTimeObjectFromTimeStr: function (timeStr) {
    console.log("timeStr = " +timeStr);
    var timeMatches = TIME_REGEX.exec(timeStr.replace(':', '').trim());
    return new Time(timeMatches[2] || 0, timeMatches[3] || 0); 
  },

  getDuration : function (domTree, html) {
    var fullWalkDurationStr = domTree('dd.walk').find('b').text();
    //console.log("domTree = " + domTree('dd.walk').find('b'));
    console.log("fullWalkDurationStr = " + fullWalkDurationStr);
    console.log(domTree('b, dd.walk').text());
    return this.createTimeObjectFromTimeStr(fullWalkDurationStr);
    //return html;
  },

  getWalkDuration : function(domTree) {
    var fullWalkDurationStr = domTree('dd.walk');
    //return this.createTimeObjectFromTimeStr(fullWalkDurationStr);
  },

  getConnections : function (domTree) {
    var connections = [];
    var domSteps = domTree('ul.trace.step');
    for (var step = 0; step < domSteps.length; step++) {
      var departure = domTree(domSteps[step]).find('.stop').first().text();
      var arrival = domTree(domSteps[step]).find('.stop').last().text();
      var direction = DIRECTION_REGEX.exec(domTree(domSteps[step]).find('.dir').text().trim())[1];
      var startTime = this.createTimeObjectFromTimeStr(domTree(domSteps[step]).find('.start').text());
      var line = LINE_REGEX.exec(domTree(domSteps[step]).find('.ligne').attr('alt').trim())[1].toLowerCase();
      var lineType = domTree(domSteps[step]).find('.network').attr('alt').toLowerCase();
      connections.push(new Connection(departure, arrival, startTime, direction, new Transport(line, lineType)));
    };
    return connections;
  },

  getNbConnections : function (domTree) {
    return this.getConnections(domTree).length;
  }
}