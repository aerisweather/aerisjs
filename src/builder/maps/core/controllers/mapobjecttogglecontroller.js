define([
  'aeris/util',
  'backbone',
  'aeris/maps/map',
  'aeris/errors/invalidargumenterror'
], function(_, Backbone, AerisMap, InvalidArgumentError) {
  /**
   * Binds a {aeris.maps.extensions.MapObjectInterface} view to
   * a MapObjectToggle toggle model.
   *
   * @class MapObjectToggleController
   * @namespace aeris.builder.maps.core.controllers
   * @extends Backbone.View
   *
   * @param {Object} options
   * @param {aeris.builder.maps.core.models.MapObjectToggle} options.model
   * @param {aeris.builder.maps.core.models.State} options.appState Required.
   * @param {aeris.maps.Map=} options.map
   * @param {aeris.Model|aeris.Collection=} options.data
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
     * @type {aeris.builder.maps.core.models.State}
     * @property appState_
     */
    this.appState_ = options.appState;

    /**
     * The map object state
     *
     * @property model
     * @type {aeris.builder.maps.core.models.MapObjectToggle}
     */


    /**
     * @private
     * @type {aeris.maps.Map}
     * @property map_
     */
    this.map_ = options.map;


    /**
     * Map object view.
     *
     * @property view_
     * @private
     * @type {aeris.maps.MapObjectInterface}
     */


    /**
     * The data model associated with
     * our MapObject.
     *
     * @type {data|undefined}
     * @private
     * @property data_
     */
    this.data_ = options.data;


    Backbone.View.call(this, options);





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
   * @method render
   */
  MapObjectToggleController.prototype.render = function() {
    this.trigger('before:render');
    if (this.onBeforeRender) { this.onBeforeRender(); }

    this.view_ = this.createView_();

    if (this.model.get('selected')) {
      this.view_.setMap(this.map_);
    }

    // Bind controller map to appState's map
    this.listenTo(this.appState_, {
      'change:map': function(state, map) {
        this.setMap(this.appState_.getMap());
      }
    });
    this.setMap(this.appState_.getMap());

    this.trigger('render');
    if (this.onRender) { this.onRender(); }
  };


  /**
   * Create an instance of the map object.
   *
   * @return {aeris.maps.MapObjectInterface}
   * @protected
   * @method createView_
   */
  MapObjectToggleController.prototype.createView_ = function() {
    var MapObject = this.model.getMapObject();
    var mapObjectOptions = {};

    if (this.data_) {
      mapObjectOptions.data = this.data_;
    }

    return new MapObject(undefined, mapObjectOptions);
  };


  /**
   * Remove the object from the map,
   * and cleans up the controller.
   * @method close
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
   * @method setMap
   */
  MapObjectToggleController.prototype.setMap = function(map) {
    var topic = map ? 'map:set' : 'map:remove';

    // Map can either be a Map or null.
    if (!(map instanceof AerisMap) && !_.isNull(map)) {
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
