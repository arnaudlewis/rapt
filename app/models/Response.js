    var Response = function (duration, walkDuration, connections, nbConnections) {
      this.duration = duration;
      this.walk_duration = walkDuration;
      this.connections = connections;
      this.nb_connections = nbConnections;
    }

    module.exports = Response;