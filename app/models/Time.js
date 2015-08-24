var Time = function(hours, minutes) {
  this.hours = hours;
  this.minutes = minutes;
}
Time.prototype.getHour = function () { return this.hours; }
Time.prototype.getMinutes = function () { return this.minutes; }

module.exports = Time;