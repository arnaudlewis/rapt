var request = require('request');

module.exports = {

  getAddress : function (latitude,longitude, callback){
    
    request('http://maps.googleapis.com/maps/api/geocode/json?latlng='+ latitude +','+ longitude +'&sensor=true&language=fr', function(error, response, body){
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        adresseDepart = data.results[0].address_components[0].long_name+' '+data.results[0].address_components[1].long_name+', '+ data.results[0].address_components[6].long_name+' '+data.results[0].address_components[3].long_name;
        callback(adresseDepart);
      }
    })
  }
};