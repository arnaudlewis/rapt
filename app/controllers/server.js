var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var request = require('request');

var Scraper = require('../components/Scraper');
var WapScraper = require('../components/WapScraper');
var ReverseGeocoder = require('../components/ReverseGeocoder');
var MetroStations = require('../data/MetroStations');
var RequestParamsReader = require('../components/RequestParamsReader');
var API_MODE = require('../models/ApiMode');

app.set('port', (process.env.PORT || 5000));

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.get('/itinerary', function(req, res, next) {

  var requestParams = url.parse(req.url,true).query;
  ReverseGeocoder.getAddress(requestParams.geolocation_latitude, requestParams.geolocation_longitude, function(address) {
    var params = {address: address, station: requestParams.arrival};

    switch (requestParams.mode) {
      case API_MODE.WAP_MODE: 
      requestWapRatp(RequestParamsReader.execute(API_MODE.WAP_MODE, params), function(html) {
        res.status(200)
        .send(JSON.stringify(WapScraper.execute(html)));
      });
      break;

      case API_MODE.DEFAULT_MODE:
      requestRatp(RequestParamsReader.execute(API_MODE.DEFAULT_MODE, params), function(html) {
        res.status(200)
        .send(JSON.stringify(Scraper.execute(html)));
      });
      break;

      default:
      res.status(404).send('No endpoint here, try with mode=WAP or mode=DEFAULT');
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

function requestRatp (params, callback) {
  var options = {
    url: 'http://www.ratp.fr/itineraires/fr/ratp/recherche-avancee',
    qs: params,
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

function requestWapRatp (params, callback) {
  var options = {
    url: 'http://wap.ratp.fr/siv/itinerary-list',
    qs: params,
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

// stationArrivee = $(this).html() + " (METRO), "+$(this).data("ville");

// https://rapt-api.herokuapp.com/itinerary?geolocation_latitude=48.873539&geolocation_longitude=2.361709&arrival=Le+V%C3%A9sinet-Le+Pecq+%28RER%29%2C+Le+V%C3%A9sinet