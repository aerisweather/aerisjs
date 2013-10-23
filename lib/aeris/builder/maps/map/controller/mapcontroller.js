define([
  'aeris/util',
  'vendor/backbone',
  'base/map'
], function(_, Backbone, Map) {
  /**
   * Controls and handles all interactions with the {aeris.maps.Map} view
   * and related {aeris.maps.extensions.MapExtensionObject} objects.
   *
   * @class aeris.builder.maps.map.controller.MapController
   * @extends Backbone.View
   *
   * @param {Object} opt_options
   * @param {aeris.builder.maps.map.model.State} opt_options.state
   *        Provided for dependency injection.
   * @param {number} opt_options.zoom
   * @param {Array.<number>} opt_options.center
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
     */
    this.options_ = options;


    /**
     * The state of the application.
     *
     * @type {aeris.builder.maps.map.model.State}
     * @private
     */
    this.state_ = options.state;


    Backbone.View.call(this, options);


    this.listenTo(this, {
      // Bind: state <--> map view
      render: function() {
        this.bindStateToView_();
        this.bindViewToState_();
      }
    });
  };
  _.inherits(MapController, Backbone.View);


  /**
   * Renders the map.
   *
   * @chainable
   */
  MapController.prototype.render = function() {
    var mapOptions = {};

    // Trigger Marionette-like before:render event
    this.trigger('before:render');

    // Set initial map state.
    // Avoid passing in 'key: undefined',
    // as this may override a defined key.
    _.each(['zoom', 'center', 'baseLayer'], function(opt) {
      if (!_.isUndefined(this.options_[opt])) {
        mapOptions[opt] = this.options_[opt];
      }
    }, this);

    this.map_ = new Map(this.el, mapOptions);

    // Trigger Marionette-like before:render event
    this.trigger('render');

    // Register with the application state
    this.updateState_();

    return this;
  };

  /**
   * @return {aeris.maps.Map}
   */
  MapController.prototype.getMap = function() {
    return this.map_;
  };


  /**
   * Keep the view updated when the state changes,
   * (eg. via router, or programmatic state changes))
   *
   * @private
   */
  MapController.prototype.bindViewToState_ = function() {
    this.listenTo(this.state_, {
      'change': this.updateView_
    });
  };


  /**
   * Update the map view to match the
   * current application state.
   *
   * @private
   */
  MapController.prototype.updateView_ = function() {
    var attrs = {};

    // Prevent setting undefined state attributes
    _.each(['center', 'zoom'], function(prop) {
      var stateValue = this.state_.get(prop);
      if (!_.isUndefined(stateValue)) {
        attrs[prop] = stateValue;
      }
    }, this);

    this.map_.set(attrs, { validate: true });
  };

  /**
   * Keep the state object updated when the
   * view is changed (eg. via direct UI interactions like scroll to zoom, etc);
   *
   * @private
   */
  MapController.prototype.bindStateToView_ = function() {
    this.listenTo(this.map_, {
      'change': this.updateState_
    });
  };


  /**
   * Update the state object to reflect the actual
   * state of our map view object.
   *
   * @private
   */
  MapController.prototype.updateState_ = function() {
    this.state_.set({
      map: this.map_,
      center: this.map_.get('center'),
      zoom: this.map_.get('zoom')
    }, {
      validate: true
    });
  };


  return MapController;
});
