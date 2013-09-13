define(['aeris/util', 'aeris/events', 'base/abstractmap', 'base/mapoptions'], function(_, Events, Map, MapOptions) {


  /**
   * @constructor
   */
  var MockMap = function() {
    var MockMap_ = function() {};
    _.inherits(MockMap_, Map);

    var MockMapOptions_ = function() {
      Events.call(this);
    };
    _.inherits(MockMapOptions_, MapOptions);

    var mockMap = new MockMap_();
    mockMap.options = new MockMapOptions_();

    return mockMap;
  };

  return MockMap;

});
