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
    //var stationRegex = new RegExp("^(.*)([\\s]\\((RER|METRO)\\)),[\\s].+$");

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
    return strAccentsOut;
  },

  sansAccent: function replaceAccents(str){
  // verifies if the String has accents and replace them
  if (str.search(/[\xC0-\xFF]/g) > -1) {
      str = str
              .replace(/[\xC0-\xC5]/g, "A")
              .replace(/[\xC6]/g, "AE")
              .replace(/[\xC7]/g, "C")
              .replace(/[\xC8-\xCB]/g, "E")
              .replace(/[\xCC-\xCF]/g, "I")
              .replace(/[\xD0]/g, "D")
              .replace(/[\xD1]/g, "N")
              .replace(/[\xD2-\xD6\xD8]/g, "O")
              .replace(/[\xD9-\xDC]/g, "U")
              .replace(/[\xDD]/g, "Y")
              .replace(/[\xDE]/g, "P")
              .replace(/[\xE0-\xE5]/g, "a")
              .replace(/[\xE6]/g, "ae")
              .replace(/[\xE7]/g, "c")
              .replace(/[\xE8-\xEB]/g, "e")
              .replace(/[\xEC-\xEF]/g, "i")
              .replace(/[\xF1]/g, "n")
              .replace(/[\xF2-\xF6\xF8]/g, "o")
              .replace(/[\xF9-\xFC]/g, "u")
              .replace(/[\xFE]/g, "p")
              .replace(/[\xFD\xFF]/g, "y");
    }

    return str;
  },

  generateWapParams: function (address, station) {
    var returnParam = {
      type1: 'adresse',
      name1: this.sansAccent(address),
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