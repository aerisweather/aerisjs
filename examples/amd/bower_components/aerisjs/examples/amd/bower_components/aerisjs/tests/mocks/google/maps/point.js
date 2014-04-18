define(['aeris/util'], function(_) {
  var root = this;
  var Point_orig = _.path('google.maps.Point', root);

  var MockPoint = function(x, y) {
    this.x = x;
    this.y = y;
  };



  MockPoint.useMockPoint = function() {
    _.expose(MockPoint, 'google.maps.Point');
  };

  MockPoint.restore = function() {
    _.expose(Point_orig, 'google.maps.Point');
  };

  return MockPoint;
});
