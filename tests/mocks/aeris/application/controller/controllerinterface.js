define([
  'ai/util'
], function(_) {
  /**
   * @class MockController
   * @implements aeris.application.controller.ControllerInterface
   *
   * @constructor
   */
  var MockController = function() {
    var stubbedMethods = [
      'render',
      'close'
    ];

    _.extend(this, jasmine.createSpyObj('controller', stubbedMethods));
  };


  return MockController;
});
