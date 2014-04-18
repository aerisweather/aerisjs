define([
  'aeris/util',
  'aeris/events',
  'mocks/mockfactory'
], function(_, Events, MockFactory) {
  /**
   * @class MockController
   * @implements aeris.application.controllers.ControllerInterface
   *
   * @constructor
   */
  var MockController = new MockFactory({
    methods: [
      'render',
      'close',
      'setElement'
    ],
    constructor: function() {
      Events.call(this);
    }
  });
  _.extend(MockController.prototype, Events.prototype);


  MockController.prototype.render = function() {
    this.trigger('render');
  };


  MockController.prototype.close = function() {
    this.trigger('close');
  };


  return MockController;
});
