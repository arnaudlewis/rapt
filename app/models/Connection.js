var Connection = function (departure, startTime, direction, transport) {
  this.departure = departure;
  this.start_time = startTime;
  this.direction = direction;
  this.transport = transport;
}

Connection.prototype.getDeparture = function () { return this.departure; }
Connection.prototype.getStartTime = function () { return this.startTime; }
Connection.prototype.getDirection = function () { return this.direction; }
Connection.prototype.getTransport = function () { return this.transport; }

module.exports = Connection;