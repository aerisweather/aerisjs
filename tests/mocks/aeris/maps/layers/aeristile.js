define([
  'aeris/util',
  'mocks/mockfactory',
  'mocks/mapobject'
], function(_, MockFactory, MockMapObject) {
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
      'resetStrategy'
    ],
    constructor: function() {
      this.set('opacity', 1, { silent: true });

      if (!this.getMap()) {
        this.setMap(null, { silent: true });
      }
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

  MockAerisTile.prototype.isShown = function() {
    var isSetToMap = !_.isNull(this.getMap());
    var isVisible = this.getOpacity() > 0;
    return isSetToMap && isVisible;
  };


  return MockAerisTile;
});
