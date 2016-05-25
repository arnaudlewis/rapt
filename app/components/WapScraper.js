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
    console.log(timeMatches);
    return new Time(timeMatches[2], timeMatches[3]); 
  },

  getDuration : function (domTree) {
    var durationStr = domTree('.subtitle').find('.bwhite').first().text();[]
    return this.createTimeObjectFromTimeStr(durationStr);
  },

  mergeTimeObject: function (first, second) {
    var minutes = (first.getMinutes() + second.getMinutes()) % 60;
    var hours = first.getHours() + second.getHours() + Math.floor((first.getMinutes() + second.getMinutes()) / 60);
    console.log(minutes + " ||| " + hours);
    return new Time(hours, minutes);
  },

  getWalkDuration : function(domTree) {
      /*domTree('img[src$="marche_1.gif"]').map(function($elem, index) {
        return createTimeObjectFromTimeStr($elem.parent().next().find('b').text());
      }).reduce(function(prev, current, index, array) {
        return this.mergeTimeObject(previous, current);
      })
    );*/
  },

  getConnections : function (domTree) {
    var connections = [];
    console.log(domTree('div.bg3'));
    var domSteps = domTree('div.bg3');

    var counterStep = 0;

    for(var dataStep=1; dataStep < domSteps.length+1; dataStep++){
      var departure;
      var arrival;
      var direction;
      var startTime;
      var line;

      //Need a connection counter 
      nbSteps = domSteps.length / 4;
      console.log(nbSteps);
      //console.log(domSteps);

      if (dataStep % 4 ==0){
        direction = domTree(domSteps[dataStep]).clone().children().remove().end().text();
      }
      else if (dataStep % 4 == 1){
        
        var line = domTree(domSteps[dataStep]).children('img').attr('alt').replace(/[^\w\s]/gi, '');

        departure = domTree(domSteps[dataStep]).clone().children().remove().end().text();

        startTime = domTree(domSteps[dataStep]).children('b').last().text().replace(/[{()}]/g, '').substring(1);
      }
      else if (dataStep % 4 == 2){
        arrival = domTree(domSteps[dataStep]).clone().children().remove().end().text();
      }
      else if (dataStep % 4 == 3){
        connections.push(new Connection(departure, arrival, startTime, direction, new Transport(line, '')));
      }

    }
    return connections;
  },

  getNbConnections : function (domTree) {
    return this.getConnections(domTree).length;
  }
}