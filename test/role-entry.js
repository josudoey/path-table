var assert = require('assert')
var RoleEntry = require('../lib/role-entry')

describe('role entry', function () {
  it('addIndex', function () {
    var entry = new RoleEntry()
    entry.addIndex(1)
    assert.equal(entry.Indexes)
  })

  it('exec', function () {
    var entry = new RoleEntry()
    entry.setPattern('user-*')
    var m = entry.exec(['user-a'])
    assert.ok(m, 'should be match')

    m = entry.exec(['user'])
    assert.ok(!m, 'should be not match')

    m = entry.exec(['user-b'])
    assert.ok(m, 'should be match')
  })
})
