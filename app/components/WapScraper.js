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
    return this.buildResponse(cheerio.load(html));
  },

  buildResponse: function (domTree) {
    return new Response(this.getDuration(domTree), this.getWalkDuration(domTree), this.getConnections(domTree), this.getNbConnections(domTree));
  },

  createTimeObjectFromTimeStr: function (timeStr) {
    var timeMatches = TIME_REGEX.exec(timeStr.replace(':', '').trim());
    return new Time(timeMatches[2], timeMatches[3]); 
  },

  getDuration : function (domTree) {
    var durationStr = domTree('.subtitle').find('.bwhite').first().text();
    return this.createTimeObjectFromTimeStr(durationStr);
  },

  mergeTimeObject: function (first, second) {
    var minutes = (first.getMinutes() + second.getMinutes()) % 60;
    var hours = first.getHours() + second.getHours() + Math.floor((first.getMinutes() + second.getMinutes()) / 60);
    console.log(minutes + " ||| " + hours);
    return new Time(hours, minutes);
  },

  getWalkDuration : function(domTree) {
    console.log (
      domTree('img[src$="marche_1.gif"]').map(function($elem, index) {
        return createTimeObjectFromTimeStr($elem.parent().next().find('b').text());
      }).reduce(function(prev, current, index, array) {
        return this.mergeTimeObject(previous, current);
      })
    );
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