var assert = require('assert')
var PathTable = require('../')

describe('rules', function () {
  describe('areAnyAllow', function () {
    var tb = new PathTable()
    before(function () {
      var entries = [{
        action: 'deny',
        path: '/test/deny'
      }, {
        action: 'allow',
        path: '/test/:any*'
      }, {
        action: 'allow',
        method: ['get'],
        role: ['user'],
        path: '/test2/:any*'
      }, {
        action: 'deny',
        role: ['user'],
        path: '/test2/:any*'
      }, {
        action: 'allow',
        method: ['get'],
        role: ['user', 'admin'],
        path: '/test3/:any*'
      }, {
        action: 'allow',
        method: ['get'],
        role: ['user', 'admin'],
        path: '/test3/:any*'
      }, {
        action: 'allow',
        method: ['post'],
        role: ['admin'],
        path: '/test3/post'
      }]

      entries.forEach(function (entry) {
        tb.addEntry(entry)
      })
    })

    it('test', function () {
      var allow = tb.areAnyAllow('/test', 'GET', undefined)
      assert.ok(allow, 'should allow')

      allow = tb.areAnyAllow('/test/hello', 'GET', undefined)
      assert.ok(allow, 'should allow')

      allow = tb.areAnyAllow('/test/deny', 'GET', undefined)
      assert.ok(!allow, 'should not allow')
    })

    it('test2', function () {
      var allow = tb.areAnyAllow('/test2', 'GET', undefined)
      assert.ok(!allow, 'should not allow')

      allow = tb.areAnyAllow('/test2/hello', 'GET', ['guest'])
      assert.ok(!allow, 'should not allow')

      allow = tb.areAnyAllow('/test2/hello', 'GET', ['user'])
      assert.ok(allow, 'should allow')

      allow = tb.areAnyAllow('/test2/hello', 'PUT', ['user'])
      assert.ok(!allow, 'should not allow')
    })

    it('test3', function () {
      var allow = tb.areAnyAllow('/test3', 'GET', undefined)
      assert.ok(!allow, 'should not allow')

      allow = tb.areAnyAllow('/test3', 'GET', ['user'])
      assert.ok(allow, 'should allow')

      allow = tb.areAnyAllow('/test3/hello', 'GET', ['admin'])
      assert.ok(allow, 'should allow')

      allow = tb.areAnyAllow('/test3/post', 'POST', ['user'])
      assert.ok(!allow, 'should not allow')

      allow = tb.areAnyAllow('/test3/post', 'POST', ['admin'])
      assert.ok(allow, 'should allow')

      allow = tb.areAnyAllow('/test3/post', 'POST', ['user', 'admin'])
      assert.ok(allow, 'should allow')

      allow = tb.areAnyAllow('/test3/post', 'POST', ['admin', 'user'])
      assert.ok(allow, 'should allow')

      allow = tb.areAnyAllow('/test3/hello', 'POST', ['admin'])
      assert.ok(!allow, 'should not allow')
    })
  })
})
