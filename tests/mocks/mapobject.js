define([
  'aeris/util',
  'aeris/model'
], function(_, Model) {
  var MockMapObject = function() {
    var stubbedMethods = [
      'setMap',
      'getMap',
      'hasMap'
    ];
    Model.apply(this, arguments);

    _.extend(this, jasmine.createSpyObj('mockMapObject', stubbedMethods));

    this.setMap.andCallFake(function(map) {
      this.set('map', map);
    });
    this.getMap.andCallFake(function(map) {
      return this.get('map');
    });
    this.hasMap.andCallFake(function() {
      return !_.isUndefined(this.get('map'));
    });
  };
  _.inherits(MockMapObject, Model);


  return MockMapObject;
});
