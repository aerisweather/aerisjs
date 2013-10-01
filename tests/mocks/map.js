define(['aeris/util', 'aeris/events', 'base/map'], function(_, Events, Map) {


  /**
   * @constructor
   */
  var MockMap = function() {
    var MockMap_ = function() {};
    _.inherits(MockMap_, Map);

    var mockMap = new MockMap_();

    return mockMap;
  };

  return MockMap;

});
