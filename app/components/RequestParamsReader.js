var API_MODE = require('../models/ApiMode');

module.exports = {

  execute: function(mode, params) {
    switch(mode) {
      case API_MODE.WAP_MODE: return this.generateWapParams(params.address, params.station); break;
      default: this.generateParams(params.address, params.station);
    }
  },

  generateParams: function (address, station) {
    return {
      start: address,
      end: station,
      date_start: -1,
      mode: "ferre_tram",
      route_type: 1,
      time : {hour: 00, minute: 55}
    }
  },

  wapStation: function (strAccents) {
    var stationRegex = new RegExp("^(.*)([\\s]\\((RER|METRO)\\)),[\\s].+$");

    var strAccents = strAccents.split('');
    var strAccentsOut = new Array();
    var strAccentsLen = strAccents.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    for (var y = 0; y < strAccentsLen; y++) {
      if (accents.indexOf(strAccents[y]) != -1) {
        strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
      } else
      strAccentsOut[y] = strAccents[y];
    }
    strAccentsOut = strAccentsOut.join('');
    return stationRegex.exec(strAccentsOut)[1];
  },

  generateWapParams: function (address, station) {
    var returnParam = {
      type1: 'adresse',
      name1: address,
      type2: 'station',
      name2: this.wapStation(station),
      reseau: 'ferre',
      traveltype: 'minimum_de_marche',
      datestart: false,
      datehour: 3,
      dateminute: 55
    };
    return returnParam;
  }
};