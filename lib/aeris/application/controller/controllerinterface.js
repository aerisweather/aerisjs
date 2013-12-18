define(function() {
  /**
   * @class aeris.application.controller.ControllerInterface
   * @interface
   * @constructor
   */
  var ControllerInterface = function() {};

  /** Render (start up) the controller */
  ControllerInterface.prototype.render = function() {};

  /** Close (destroy) the controller */
  ControllerInterface.prototype.close = function() {};


  return ControllerInterface;
});