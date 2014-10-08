define([
  'aeris/util',
  'mocks/mockfactory',
  'mocks/mapobject',
  'aeris/promise'
], function(_, MockFactory, MockMapObject, Promise) {
  /**
   * @class MockAerisTile
   */
  var MockAerisTile = MockFactory({
    name: 'MockAerisTile',
    inherits: MockMapObject,
    getSetters: [
      'opacity',
      'zIndex'
    ],
    methods: [
      'stop',
      'isLoaded',
      'show',
      'hide',
      'removeStrategy',
      'resetStrategy',
      'preload'
    ],
    constructor: function() {
      this.set('opacity', 1, { silent: true });

      if (!this.getMap()) {
        this.setMap(null, { silent: true });
      }

      this.promiseToPreload = new Promise();
    }
  });

  MockAerisTile.prototype.isLoaded = function() {
    return true;
  };

  MockAerisTile.prototype.stop = function() {
    return this;
  };

  MockAerisTile.prototype.show = function() {
    this.setOpacity(1);
  };

  MockAerisTile.prototype.hide = function() {
    this.setOpacity(0);
  };

  MockAerisTile.prototype.preload = function() {
    return this.promiseToPreload;
  };

  MockAerisTile.prototype.isShown = function() {
    var isSetToMap = !_.isNull(this.getMap());
    var isVisible = this.getOpacity() > 0;
    return isSetToMap && isVisible;
  };


  return MockAerisTile;
});
