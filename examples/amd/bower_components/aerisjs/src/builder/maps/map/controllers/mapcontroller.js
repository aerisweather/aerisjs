define([
  'aeris/util',
  'backbone',
  'aeris/maps/map'
], function(_, Backbone, Map) {
  /**
   * Controls and handles all interactions with the {aeris.maps.Map} view
   * and related {aeris.maps.extensions.MapExtensionObject} objects.
   *
   * @class MapController
   * @namespace aeris.builder.maps.map.controllers
   * @extends Backbone.View
   *
   * @param {Object} options
   * @param {aeris.builder.maps.map.models.State} options.appState
   *
   * @constructor
   */
  var MapController = function(options) {
    /**
     * @event before:render
     */
    /**
     * @event render
     */

    /**
     * @type {Object}
     * @private
     * @property options_
     */
    this.options_ = options;


    /**
     * Map state.
     *
     * @property model
     * @type {aeris.Model}
     *
    */


    /**
     * The state of the application.
     *
     * @type {aeris.builder.maps.map.models.State}
     * @private
     * @property appState_
     */
    this.appState_ = options.appState;


    Backbone.View.call(this, options);


    this.listenTo(this, 'render', function() {
        // Update map view when map state changes
        this.listenTo(this.model, 'change', this.updateMapView_);

        // Update map state when map view changes
        // (eg. user drags map to change center)
        this.listenTo(this.map_, 'change', this.updateMapState_);


        this.updateMapState_();
    });

    // Update map state immediately
    // So we start of nice and synced.
    this.listenTo(this, 'render', this.updateMapState_);

    // Register map with application state
    this.listenTo(this, 'render', function() {
      this.appState_.set('map', this.map_);
    });
  };
  _.inherits(MapController, Backbone.View);


  /**
   * Creates the map view, rendering it
   * in the DOM.
   *
   * @chainable
   * @method render
   */
  MapController.prototype.render = function() {
    var mapOptions = this.model.toJSON();

    // Trigger Marionette-like before:render event
    this.trigger('before:render');

    this.map_ = new Map(this.el, mapOptions);

    // Trigger Marionette-like before:render event
    this.trigger('render');

    return this;
  };

  /**
   * @return {aeris.maps.Map}
   * @method getMap
   */
  MapController.prototype.getMap = function() {
    return this.map_;
  };


  /**
   * Update the map view to match the
   * current application state.
   *
   * @private
   * @method updateMapView_
   */
  MapController.prototype.updateMapView_ = function() {
    this.map_.set(this.model.toJSON(), { validate: true });
  };


  /**
   * Update the state object to reflect the actual
   * state of our map view object.
   *
   * @private
   * @method updateMapState_
   */
  MapController.prototype.updateMapState_ = function() {
    this.model.set({
      map: this.map_,
      center: this.map_.get('center'),
      zoom: this.map_.get('zoom')
    }, {
      validate: true
    });
  };


  return MapController;
});
