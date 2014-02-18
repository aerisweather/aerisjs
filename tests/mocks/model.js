define([
  'aeris/util'
], function(_) {
  /**
   * @class MockModel
   * @param {object} opt_attrs List of attributes to stub.
   * @return {Object} Mock for a {aeris.Model} object.
   * @constructor
   */
  var MockModel = function(opt_attrs) {
    var cannedAttrs = opt_attrs || {};

    this.get = jasmine.createSpy('model#get').
      andCallFake(function(attr) {
        return cannedAttrs[attr];
      });
  };

  return MockModel;
});
