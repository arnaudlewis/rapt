var express = require('express');
var http = require('http');
var url = require('url');
var request = require('request');

var Scraper = require('../components/Scraper');
var ReverseGeocoder = require('../components/ReverseGeocoder');


var app = express();

http.createServer(function (req, res) {
  if(req.method == "GET") {
    if(req.url.match('/itinerary.*')) {
      res.writeHead(200, {
        'Content-Type': 'text/json',
        'Access-Control-Allow-Origin' : "*"
      });
      var requestParams = url.parse(req.url,true).query;

      ReverseGeocoder.getAddress(requestParams.latitude, requestParams.longitude, function(address) {
        requestRatp(address, requestParams.station, function(html) {
          res.end(JSON.stringify(Scraper.execute(html)));
        });
      });
    } else {
      res.writeHead(404, "Page not found, try again buddy");
    }
  }
}).listen(5000);

function requestRatp(address, station, callback) {
  var options = {
    url: 'http://www.ratp.fr/itineraires/fr/ratp/recherche-avancee',
    qs: generateParams(address, station),
    headers: {
      'User-Agent': 'hackday',
      'Accept': 'text/html'
    }
  };
  request(options, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      callback(html);
    }
  });
}

function generateParams(address, station) {
  return {
    start: address,
    end: station,
    date_start: -1,
    mode: "ferre_tram",
    route_type: 1,
    time : {hour: 23, minute: 45}
  }
}
