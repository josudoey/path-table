var PathEntry = require('./path-entry')
var RoleEntry = require('./role-entry')

var Table = function () {
  this.clear()
}

var prop = Table.prototype

prop.clear = function () {
  this.roleIndexes = {}
  this.roleEntries = [
    new RoleEntry()
  ]
  this.pathEntries = []
}

prop.addEntry = function (entry) {
  var roleIndexes = this.roleIndexes
  var roleEntries = this.roleEntries
  var pathEntries = this.pathEntries
  var pathEntry = new PathEntry(entry.path, entry.action, entry.method)
  var pathIndex = pathEntries.length
  pathEntries.push(pathEntry)
  if (!entry.role) {
    roleEntries[0].addIndex(pathIndex)
    return
  }

  if (!Array.isArray(entry.role)) {
    throw new Error('role should be array')
  }

  entry.role.forEach(function (roleItem) {
    if (typeof roleItem !== 'string') {
      throw new Error('role item should be string')
    }
    var roleIndex = roleIndexes[roleItem]
    if (!roleIndex) {
      var roleEntry = new RoleEntry()
      roleEntry.setPattern(roleItem)
      roleIndex = roleIndexes[roleItem] = roleEntries.length
      roleEntries.push(roleEntry)
    }
    roleEntries[roleIndex].addIndex(pathIndex)
  })
}

prop.areAnyAllow = function (path, method, roles) {
  var pathEntries = this.pathEntries
  var roleIndexes = this.roleIndexes
  var roleEntries = this.roleEntries
  var defaultEntries = this.roleEntries[0].indexes
  var i = 0
  var l = 0
  if (!roles) {
    l = defaultEntries.length
    for (var i = 0; i < l; i++) {
      var pathEntry = pathEntries[i]
      if (pathEntry.exec(path, method)) {
        if (pathEntry.action === 'allow') {
          return true
        }
        return false
      }
    }
    return false
  }
  var hitEntry = {}
  l = roleEntries.length
  for (i = 1; i < l; i++) {
    var roleEntry = roleEntries[i]
    if (roleEntry.exec(roles)) {
      roleEntry.indexes.forEach(function (index) {
        if (!(index in hitEntry)) {
          hitEntry[index] = true
        }
      })
    }
  }

  var matchEntries = defaultEntries.concat(Object.keys(hitEntry)).sort(function (a, b) {
    return a - b
  })

  l = matchEntries.length
  for (i = 0; i < l; i++) {
    var pathEntry = pathEntries[i]
    if (pathEntry.exec(path, method)) {
      if (pathEntry.action === 'allow') {
        return true
      }
      return false
    }
  }
  return false
}
exports = module.exports = Table
