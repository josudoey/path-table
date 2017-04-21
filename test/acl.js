var assert = require('assert')
var PathTable = require('../')

describe('rules', function () {
  it('allow', function () {
    var tb = new PathTable()
    var rules = [{
      action: 'allow',
      role: ['*'],
      method: ['get', 'post'],
      path: ['/hello']
    }]
    tb.addRules(rules)
    var allow = tb.isAllow(undefined, '/any*', 'GET')
    assert.ok(allow, 'should allow')
  })
})
