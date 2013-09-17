define([
  'aeris/util',
  'aeris/events',
  'aeris/promise',
  'base/extension/mapextensionobject'
], function(_, Events, Promise, MapExtensionObject) {


  /**
   * A Layer is a data wrapper for a specific type of layer. The type of layer
   * is defined by the strategy property an can only be used if a
   * LayerManagerStrategy is provided.
   *
   * @constructor
   * @class aeris.maps.Layer
   * @extends {aeris.maps.extension.MapExtensionObject}
   * @extends {aeris.Events}
   */
  var Layer = function() {
    MapExtensionObject.call(this);
    Events.call(this);


    /**
     * The visibility of the layer where true is visible and false is hidden.
     *
     * @type {boolean}
     */
    this.visible = true;


    /**
     * The opacity of the layer with value between 0 and 1.0.
     *
     * @type {number}
     */
    this.opacity = 1.0;


    /**
     * The z-index of the layer when set as a non base layer.
     *
     * @type {number}
     */
    this.zIndex = 1;

    /**
     * Milliseconds between an autoupdate of the data.
     *
     * @type {number}
     * @default
     */
    this.autoUpdateInterval = 1000 * 60;


    /**
     * Determine if the map has been initialized.
     *
     * @type {aeris.Promise}
     */
    this.initialized = new Promise();


  };
  _.inherits(Layer, MapExtensionObject);
  _.extend(Layer.prototype, Events.prototype);


  /**
   * @override
   */
  Layer.prototype.setMap = function(aerisMap) {
    MapExtensionObject.prototype.setMap.call(this, aerisMap);
    if (aerisMap !== null)
      this.aerisMap.layers.setLayer(this);
    else
      this.remove();
  };


  /**
   * Remove the layer from the map. Same as setting the map to null.
   */
  Layer.prototype.remove = function() {
    var map = this.aerisMap;
    this.aerisMap = null;
    map.layers.removeLayer(this);
  };


  /**
   * Display the layer.
   *
   * @param {boolean} trigger Trigger the visible change event. Default = true.
   * @return {undefined}
   */
  Layer.prototype.show = function(trigger) {
    this.visible = true;
    if (this.aerisMap)
      this.aerisMap.layers.showLayer(this, trigger);
  };


  /**
   * Hide the layer.
   *
   * @param {boolean} trigger Trigger the visible change event. Default = true.
   * @return {undefined}
   */
  Layer.prototype.hide = function(trigger) {
    this.visible = false;
    if (this.aerisMap)
      this.aerisMap.layers.hideLayer(this, trigger);
  };


  /**
   * Set the opacity of the layer.
   *
   * @param {number} opacity The opacity to set the layer to.
   * @return {undefined}
   */
  Layer.prototype.setOpacity = function(opacity) {
    this.opacity = opacity = parseFloat(opacity);
    if (this.aerisMap)
      this.aerisMap.layers.setLayerOpacity(this, opacity);
  };


  /**
   * Get an animation object of the layer and start the animation.
   *
   * @return {aeris.maps.LayerAnimation}
   */
  aeris.maps.Layer.prototype.animate = function() {
    return this.aerisMap.layers.animateLayer(this);
  };


  /**
   * Determine if the layer has the ability to animate.
   *
   * @return {boolean}
   */
  aeris.maps.Layer.prototype.canAnimate = function() {
    return this.animate() !== undefined;
  };


  /**
   * Auto-update the layer.
   *
   * @param {Object} opt_options Optional configuration options.
   */
  Layer.prototype.autoUpdate = function(opt_options) {
    this.aerisMap.layers.autoUpdateLayer(this, opt_options);
  };


  /**
   * Clone a layer.
   *
   * @param {Object} properties Additional properties to extend on the layer.
   * @return {aeris.maps.Layer}
   */
  Layer.prototype.clone = _.abstractMethod;


  return _.expose(Layer, 'aeris.maps.Layer');

});
