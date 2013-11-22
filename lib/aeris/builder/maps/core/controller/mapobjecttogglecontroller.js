define([
  'aeris/util',
  'vendor/backbone',
  'aeris/errors/invalidargumenterror'
], function(_, Backbone, InvalidArgumentError) {
  /**
   * Binds a {aeris.maps.extension.MapObjectInterface} view to
   * a MapObjectToggle toggle model.
   *
   * @class aeris.builers.maps.map.controller.MapObjectToggleController
   * @extends Backbone.View
   *
   * @param {Object} options
   * @param {aeris.builder.maps.core.model.MapObjectToggle} options.model
   * @param {aeris.maps.Map} options.map
   * @param {aeris.builder.maps.core.model.State} options.appState Required.
   *
   *
   * @constructor
   */
  var MapObjectToggleController = function(options) {
    options = _.extend({
      map: null
    }, options);


    /**
     * The application state
     *
     * @type {aeris.builder.maps.core.model.State}
     */
    this.appState_ = options.appState;

    /**
     * The map object state
     *
     * @property model
     * @type {aeris.builder.maps.core.model.MapObjectToggle}
     */


    /**
     * @private
     * @type {aeris.maps.Map}
     */
    this.map_ = options.map;


    /**
     * Map object view.
     *
     * @property view_
     * @private
     * @type {aeris.maps.MapObjectInterface}
     */



    Backbone.View.call(this, options);


    // Bind controller map to appState's map
    this.listenTo(this.appState_, {
      'change:map': function(state, map) {
        this.setMap(map);
      }
    });
    if (!_.isUndefined(this.appState_.get('map'))) {
      this.setMap(this.appState_.get('map'));
    }


    // Bind view to state's
    // 'selected' property
    this.listenTo(this.model, {
      'select': function() {
        if (this.view_) {
          this.view_.setMap(this.map_);
        }
      },
      'deselect': function() {
        if (this.view_) {
          this.view_.setMap(null);
        }
      }
    });
  };
  _.inherits(MapObjectToggleController, Backbone.View);


  /**
   * Creates a {aeris.maps.MapObjectInterface} object.
   *
   * If the state is selected, sets the view to the map.
   */
  MapObjectToggleController.prototype.render = function() {
    var MapObject;

    this.trigger('before:render');
    if (this.onBeforeRender) { this.onBeforeRender(); }

    MapObject = this.model.getMapObject();

    this.view_ = this.createView_(MapObject);

    if (this.model.get('selected')) {
      this.view_.setMap(this.map_);
    }

    this.trigger('render');
    if (this.onRender) { this.onRender(); }
  };


  /**
   * Create an instance of the map object.
   *
   * @param {Function} MapObject Constructor.
   * @return {aeris.maps.MapObjectInterface}
   * @protected
   */
  MapObjectToggleController.prototype.createView_ = function(MapObject) {
    return new MapObject();
  };


  /**
   * Remove the object from the map,
   * and cleans up the controller.
   */
  MapObjectToggleController.prototype.close = function() {
    this.trigger('before:close');
    if (this.onBeforeClose) { this.onBeforeClose(); }

    this.view_.setMap(null);
    this.stopListening();

    this.trigger('close');
    if (this.onClose) { this.onClose(); }
  };


  /**
   * Associates a map with this controller, on which
   * to render map objects.
   *
   * If the state is selected,
   * sets the view to the map.
   *
   * @param {aeris.maps.Map} map
   */
  MapObjectToggleController.prototype.setMap = function(map) {
    var topic = map ? 'map:set' : 'map:remove';

    // Map can either be a Map or null.
    if (!(map instanceof aeris.maps.Map) && !_.isNull(map)) {
      throw new InvalidArgumentError('Unable to set MakerController map: invalid map');
    }

    this.map_ = map;

    // Set the view to the map,
    // if we're rendered, and our state is selected.
    if (this.model.get('selected') && this.view_) {
      this.view_.setMap(map);
    }

    // Trigger map:set / map:remove events
    this.trigger(topic, map);
  };


  return MapObjectToggleController;
});
