var assert = require('assert')
var PathEntry = require('../lib/path-entry')

describe('path entry', function () {
  it('exec (no methods)', function () {
    var entry = new PathEntry('/any*', 'allow')
    var m = entry.exec('/any')
    assert.ok(m, 'should be match')
  })

  it('exec (has methods)', function () {
    var entry = new PathEntry('/test/:any+', 'allow', ['get', 'post'])
    var m = entry.exec('/test/hello', 'GET')
    assert.ok(m, 'should be match')

    m = entry.exec('/test', 'GET')
    assert.ok(!m, 'should be not match')

    m = entry.exec('/test/hello', 'POST')
    assert.ok(m, 'should be match')

    m = entry.exec('/test/hello', 'PUT')
    assert.ok(!m, 'should be not match')
  })
})
