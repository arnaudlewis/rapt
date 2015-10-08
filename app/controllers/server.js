var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var request = require('request');

var Scraper = require('../components/Scraper');
var WapScraper = require('../components/WapScraper');
var ReverseGeocoder = require('../components/ReverseGeocoder');
var MetroStations = require('../data/MetroStations');

app.set('port', (process.env.PORT || 5000));

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.get('/itinerary', function(req, res, next) {

  var requestParams = url.parse(req.url,true).query;
  ReverseGeocoder.getAddress(requestParams.geolocation_latitude, requestParams.geolocation_longitude, function(address) {
    switch (requestParams.mode) {
      case 'wap': 
      requestWapRatp(address, requestParams.arrival, function(html) {
        res.status(200)
        .send(JSON.stringify(WapScraper.execute(html)));
      });
      break;

      default:
      requestRatp(address, requestParams.arrival, function(html) {
        res.status(200)
        .send(JSON.stringify(Scraper.execute(html)));
      });
    };
  });
});

app.get('/stations', function(req, res, next) {

  res.status(200).send(JSON.stringify(MetroStations));
});

app.get('/*', function(req, res) {
 res.status(404)
 .send('Sorry but there\'s nothing there. Try again buddy !');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function requestRatp (address, station, callback) {
  var options = {
    url: 'http://www.ratp.fr/itineraires/fr/ratp/recherche-avancee',
    qs: generateParams(address, station),
    headers: {
      'User-Agent': 'rapt',
      'Accept': 'text/html'
    }
  };
  request(options, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      callback(html);
    }
  });
}

function requestWapRatp (address, station, callback) {
  var options = {
    url: 'http://wap.ratp.fr/siv/itinerary-list',
    qs: generateWapParams(address, station),
    headers: {
      'User-Agent': 'rapt',
      'Accept': 'text/html'
    }
  };
  request(options, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      callback(html);
    }
  });
}

function generateParams (address, station) {
  return {
    start: address,
    end: station,
    date_start: -1,
    mode: "ferre_tram",
    route_type: 1,
    time : {hour: 01, minute: 55}
  }
}

function wapStation(strAccents) {
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
  }

function generateWapParams (address, station) {
  console.log(address);
  console.log(wapStation(station));
  return {
    type1: 'adresse',
    name1: address,
    type2: 'station',
    name2: wapStation(station),
    reseau: 'ferre',
    traveltype: 'plus_rapide',
    datestart: false,
    datehour: 3,
    dateminute: 55
  }
}

// stationArrivee = $(this).html() + " (METRO), "+$(this).data("ville");

// https://rapt-api.herokuapp.com/itinerary?geolocation_latitude=48.873539&geolocation_longitude=2.361709&arrival=Le+V%C3%A9sinet-Le+Pecq+%28RER%29%2C+Le+V%C3%A9sinet