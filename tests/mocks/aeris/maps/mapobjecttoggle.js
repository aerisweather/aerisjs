define([
  'aeris/util',
  'mocks/aeris/toggle'
], function(_, MockToggle) {
  var MockMapObjectToggle = function(opt_attrs, opt_options) {
    var stubbedMethods = [
      'setMap',
      'getMap',
      'hasMap'
    ];
    var attrs = _.defaults(opt_attrs || {}, {
      map: null
    });

    MockToggle.call(this, attrs, opt_options);

    stubbedMethods.forEach(function(method) {
      spyOn(this, method).andCallThrough();
    }, this);
  };
  _.inherits(MockMapObjectToggle, MockToggle);


  /**
   * @method setMap
   * @param {aeris.maps.Map} map
   */
  MockMapObjectToggle.prototype.setMap = function(map, opts) {
    this.set('map', map);

    if (_.isNull(map)) {
      this.trigger('map:remove', null, opts || {});
    }
    else {
      this.trigger('map:set', map, opts || {});
    }
  };

  /**
   * @method getMap
   * @return {aeris.maps.Map}
   */
  MockMapObjectToggle.prototype.getMap = function() {
    return this.get('map');
  };


  MockMapObjectToggle.prototype.hasMap = function() {
    return !_.isNull(this.get('map'));
  };


  return MockMapObjectToggle;
});
