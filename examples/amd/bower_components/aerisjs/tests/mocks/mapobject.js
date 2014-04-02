define([
  'aeris/util',
  'aeris/model',
  'mocks/mockfactory'
], function(_, Model, MockFactory) {
  var MockMapObject = new MockFactory({
    methods: [
      'setMap',
      'getMap',
      'hasMap'
    ],
    inherits: Model
  });

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
    return !!_.isNull(this.get('map'));
  };


  return MockMapObject;
});
