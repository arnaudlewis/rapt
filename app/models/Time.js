var Time = function(hours, minutes) {
  this.hours = hours || 0;
  this.minutes = minutes || 0;
}
Time.prototype.getHour = function () { return this.hours; }
Time.prototype.getMinutes = function () { return this.minutes; }

module.exports = Time;