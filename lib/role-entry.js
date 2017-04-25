var Minimatch = require('minimatch').Minimatch
var Entry = function () {
  this.indexes = []
}

var prop = Entry.prototype

prop.addIndex = function (index) {
  this.indexes.push(index)
}

prop.setPattern = function (pattern) {
  this.re = new Minimatch(pattern).makeRe()
}

prop.exec = function (roles) {
  var l = roles.length
  var m = null
  var re = this.re
  for (var i = 0; i < l; i++) {
    m = re.exec(roles[i])
    if (m) {
      return m
    }
  }
  return null
}
exports = module.exports = Entry
