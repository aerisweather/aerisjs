define([
  'aeris/util',
  'mocks/mockfactory',
  'mocks/mapobject'
], function(_, MockFactory, MockMapObject) {
  /**
   * @class MockMap
   *
   * @constructor
   */
  var MockMap = MockFactory({
    getSetters: [
      'bounds',
      'center',
      'zoom'
    ],
    methods: [
      'getView',
      'fitToBounds'
    ],
    name: 'Mock_Map',
    constructor: function(el, opt_attrs, opt_options) {
      var attrs = _.defaults(opt_attrs || {}, {
        el: el,
        bounds: [0, 0, 100, 100],
        center: [0, 0],
        zoom: 10
      });

      MockMapObject.call(this, attrs, opt_options);
    }
  });
  _.defaults(MockMap.prototype, MockMapObject.prototype);

  return MockMap;
});
