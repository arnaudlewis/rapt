	var Transport = function (line, typ) {
  this.line = line;
  this.typ = typ;
}

Transport.prototype.getLine = function () { return this.line; }
Transport.prototype.getTyp = function () { return this.typ; }

module.exports = Transport;
