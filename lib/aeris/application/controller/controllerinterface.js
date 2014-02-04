define(function() {
  /**
   * @class ControllerInterface
   * @namespace aeris.application.controller
   * @interface
   * @constructor
   */
  var ControllerInterface = function() {};

  /**
   * Render (start up) the controller
   * @method render
   */
  ControllerInterface.prototype.render = function() {};

  /**
   * Close (destroy) the controller
   * @method close 
   */
  ControllerInterface.prototype.close = function() {};


  return ControllerInterface;
});