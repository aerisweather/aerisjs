define([
  'aeris/util',
  'mocks/mockfactory',
  'aeris/maps/layers/animationlayer'
], function(_, MockFactory, AnimationLayer) {
  /**
   * @class MockAnimationLayer
   * @constructor
   */
  var MockAnimationLayer = MockFactory({
    inherits: AnimationLayer,
    methods: [
      'show',
      'hide',
      'fadeTo',
      'setMap',
      'hasMap'
    ]
  });


  return MockAnimationLayer;
});
