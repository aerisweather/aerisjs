define([
  'aeris/util',
  'aeris/events'
], function(_, Events) {
  /**
   * A Strategy is created by a MapExtensionObject. It's job is
   * to:
   * - Render the MapExtObj
   * - Listen for changes to a MapExtObj, and render
   *   those changes.
   *
   * Strategies may use mapping libraries (eg. gmaps/openlayers)
   * to render a MapExtObj. In fact, strategies should be the only
   * place in the library where we find direct interactions with
   * specific mapping libraries.
   *
   * @class aeris.maps.AbstractStrategy
   * @constructor
   *
   * @param {aeris.maps.MapObjectInterface} obj
   *        The aeris object to associate with the map view.
   */
  var AbstractStrategy = function(obj) {
    /**
     * @type {aeris.maps.extension.MapExtensionObject}
     * @protected
     */
    this.object_ = obj;


    /**
     * The map associated with this object
     * @type {?google.maps.Map}
     */
    this.mapView_;

    /**
     * Evens to bind the map view to the
     * object.
     *
     * Binds object attribute 'change'
     * events to strategy methods.
     *
     * @private
     */
    this.objectEvents_ = _.extend({}, this.objectEvents_, {
      'map:set': function(model, map) {
        this.setMap(map);
      },
      'map:remove': this.remove
    });


    Events.call(this);

    /**
     * The view instance created by
     * the map rendering API.
     *
     * @type {Object}
     */
    this.view_ = this.createView_();


    // Bind this.objectEvents to this.object_
    this.listenTo(this.object_, this.objectEvents_);


    // Set to map, if object has one
    if (this.object_.hasMap()) {
      this.setMap(this.object_.getMap());
    }
  };
  _.extend(AbstractStrategy.prototype, Events.prototype);


  /**
   * Render an object on a map.
   *
   * @param {aeris.maps.Map} aerisMap
   * @abstract
   */
  AbstractStrategy.prototype.setMap = function(aerisMap) {
    // Remove the object first, if it's already
    // set to a map
    if (this.mapView_) { this.remove(); }

    // Store a reference to the map view
    this.mapView_ = aerisMap.getView();

    // Child class should do something
    // useful here...
  };


  /**
   * Remove the object view from the map view.
   */
  AbstractStrategy.prototype.remove = function() {
    // If no map exists, nothing to do here.
    if (!this.mapView_) { return; }


    // Child class should do something
    // useful in beforeRemove_
    this.beforeRemove_();


    // Remove reference to mapview
    this.mapView_ = null;

    this.afterRemove_();
  };


  /**
   * Cleans up and shuts down the strategy object.
   */
  AbstractStrategy.prototype.destroy = function() {
    this.stopListening();
  };



  /**
   * This method is called before
   * our reference to this.mapView_ is set
   * to null.
   *
   * This method must be overridden
   * to do the actual work of un-rendering
   * the map object.
   *
   * @method
   * @protected
   * @abstract
   */
  AbstractStrategy.prototype.beforeRemove_ = _.abstractMethod;


  /**
   * This method is called after
   * this.mapView_ is set to null;
   *
   * @method
   * @protected
   */
  AbstractStrategy.prototype.afterRemove_ = function() {};


  /**
   * Create a view instance.
   *
   * @type {Object}
   * @protected
   * @abstract
   * @return {Object} View instance.
   */
  AbstractStrategy.prototype.createView_ = _.abstractMethod;


  /**
   * Return the view instance
   * created by the map-rendering API.
   *
   * @return {?Object}
   */
  AbstractStrategy.prototype.getView = function() {
    return this.view_;
  };


  return AbstractStrategy;
});
