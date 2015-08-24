var cheerio = require('cheerio');
var Time = require('../models/Time');

var TIME_REGEX = new RegExp("^(([0-9]{1,2})[\\s][A-Za-z]+[\\s])?([0-9]{1,2})[\\s][A-Za-z]+$");

module.exports = {

  execute : function(html) {
    return this.buildResponse(cheerio.load(html));
  },

  buildResponse: function (domTree) {
    return {
      nb_connections: this.getNbConnections(),
      duration: this.getDuration(domTree),
      walk_duration: this.getWalkDuration(domTree)
      // connections: this.getConnections()
    }
  },

  createTimeObjectFromTimeStr: function (timeStr) {
    var timeMatches = TIME_REGEX.exec(timeStr.replace(':', '').trim());
    return new Time(timeMatches[2] || 0, timeMatches[3] || 0); 
  },

  getDuration : function (domTree) {
    var fullWalkDurationStr = domTree('dd.time').find('b').text();
    return this.createTimeObjectFromTimeStr(fullWalkDurationStr);
  },

  getWalkDuration : function(domTree) {
    var fullWalkDurationStr = domTree('dd.walk').find('b').text();
    return this.createTimeObjectFromTimeStr(fullWalkDurationStr);
  },

  getConnections : function () {
    return [];
  },

  getNbConnections : function () {
    return this.getConnections().length;
  }
}

// var result = {
//   nb_connections: "",
//   duration: "",
//   walk_duration: "",
//   connections: {
//     departure: "",
//     arrival : "",
//     start_time : "",
//     line: "",
//     direction: ""
//   }
// }