var pathToRegexp = require('path-to-regexp')
var Entry = function (pattern, action, methods) {
  this.action = action
  this.re = pathToRegexp(pattern)
  if (methods) {
    if (!Array.isArray(methods)) {
      throw new Error('methods shoud be array')
    }
    this.methods = methods.map(function (method) {
      if (typeof method !== 'string') {
        throw new Error('method shoud be string')
      }
      return method.toUpperCase()
    })
  }
}

var prop = Entry.prototype
prop.exec = function (path, method) {
  var methods = this.methods
  if (methods && methods.indexOf(method) < 0) {
    return null
  }

  return this.re.exec(path)
}
exports = module.exports = Entry
