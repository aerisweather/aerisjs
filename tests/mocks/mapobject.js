define([
  'aeris/util',
  'aeris/model',
  'mocks/mockfactory'
], function(_, Model, MockFactory) {
  /**
   * @class MockMapObject
   */
  var MockMapObject = new MockFactory({
    methods: [
      'setMap',
      'getMap',
      'hasMap'
    ],
    constructor: function(opt_attrs, opt_options) {
      var attrs = _.defaults(opt_attrs || {}, {
        map: null
      });

      Model.call(this, attrs, opt_options);
    }
  });
  _.inherits(MockMapObject, Model);

  MockMapObject.prototype.setMap = function(map) {
    if (map === this.get('map')) { return; }

    this.set('map', map);

    if (_.isNull(map)) {
      this.trigger('map:remove', this, map);
    }
    else {
      this.trigger('map:set', this, map);
    }
    this.trigger('map:change', this, map);
  };

  MockMapObject.prototype.getMap = function() {
    return this.get('map');
  };

  MockMapObject.prototype.hasMap = function() {
    return !_.isNull(this.get('map'));
  };


  return MockMapObject;
});
