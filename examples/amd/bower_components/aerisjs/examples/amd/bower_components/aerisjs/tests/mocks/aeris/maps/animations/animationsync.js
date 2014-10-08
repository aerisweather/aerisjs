define([
  'aeris/util',
  'mocks/mockfactory',
  'mocks/aeris/maps/animations/animation'
], function(_, MockFactory, MockAnimation) {
  /**
   * @class MockAnimationSync
   */
  var MockAnimationSync = MockFactory({
    name: 'MockAnimationSync',
    methods: [
      'add',
      'remove',
      'getTimes'
    ]
  });


  /**
   * @method getTimes
   */
  MockAnimationSync.prototype.getTimes = function() {
    return [];
  };


  return MockAnimationSync;
});
