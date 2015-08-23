var cheerio = require('cheerio');

module.exports = {

  connections : [],
  
  execute : function(html) {
    console.log(html);
    var domTree = cheerio.load(html);
    return this.buildResponse(domTree);
  },

  buildResponse: function (domTree) {
    return {
      nb_connections: this.getNbConnections(),
      duration: this.getDuration(),
      walk_duration: this.getWalkDuration(),
      connections: this.getConnections()
    }
  },

  getDuration : function () {

  },

  getWalkDuration : function() {

  },

  getConnections : function () {

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