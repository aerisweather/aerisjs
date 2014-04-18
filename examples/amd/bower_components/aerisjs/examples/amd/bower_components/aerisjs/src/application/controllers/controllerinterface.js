define(function() {
  /**
   * @class ControllerInterface
   * @namespace aeris.application.controllers
   * @interface
   * @constructor
   *
   * @param {Object} options
   * @param {HTMLElement|$=} options.el
   */
  var ControllerInterface = function(options) {
    /**
     * @event render
     */
    /**
     * @event close
     */
  };

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


  /**
   * See http://backbonejs.org/#View-setElement
   *
   * @method setElement
   * @param {HTMLElement|$} el
   */
  ControllerInterface.prototype.setElement = function(el) {};


  return ControllerInterface;
});
