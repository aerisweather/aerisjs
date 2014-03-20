define([
  'aeris/util',
  'aeris/application/controllers/itemcontroller'
], function(_, ItemController) {
  /**
   * Controls the Geolocation view.
   *
   * @class GeolocateController
   * @namespace aeris.builder.maps.geosearch.controllers
   * @extends aeris.application.controllers.ItemController
   *
   * @constructor
   * @override
   *
   * @param {aeris.Model} options.mapState
   * @param {aeris.Events} options.eventHub
   * @param {aeris.geolocate.GeolocateServiceResolver} options.geolocateServiceResolver
   * @param {?number=} options.zoomTo
  */
  var GeolocateController = function(options) {
    options = _.defaults(options, {
      zoomTo: null
    });


    /**
     * The application state of the
     * map.
     *
     * @type {aeris.Model}
     * @private
     * @property mapState_
     */
    this.mapState_ = options.mapState;


    /**
     * Application event hub.
     *
     * @type {aeris.Events}
     * @private
     * @property eventHub_
     */
    this.eventHub_ = options.eventHub;


    /**
     * An service object used to
     * handle geolocation requests.
     *
     * @type {aeris.geolocate.AbstractGeolocateService}
     * @private
     * @property geolocateService_
     */
    this.geolocateService_ = options.geolocateServiceResolver.resolveService();


    /**
     * When geolocation is performed,
     * the map will zoom to the level
     * defined here.
     *
     * If set as null, the zoom level
     * will not change.
     *
     * @type {?number}
     * @private
     * @property zoomTo_
     */
    this.zoomTo_ = options.zoomTo;


    /**
     * Expected UI components:
     *  geolocateBtn      The button used to trigger geolocation.
     *
     * @property ui
     * @type {Object}
     */
    options.ui = _.defaults(options.ui || {}, {
      geolocateBtn: ''
    });


    options.events || (options.events = {});
    options.events['click ' + options.ui.geolocateBtn] = this.handleButtonClick_;


    ItemController.apply(this, arguments);
  };
  _.inherits(GeolocateController, ItemController);


  /**
   * @param {jQuery.Event} evt
   * @return {false}
   * @private
   * @method handleButtonClick_
   */
  GeolocateController.prototype.handleButtonClick_ = function(evt) {
    this.geolocate();
    evt.preventDefault();
    return false;
  };


  /**
   * Update the map with the user's
   * geolocated position.
   *
   * @return {aeris.Promise}
   *         A promise to locate the user.
   *         Resolved with a {aeris.geolocate.GeolocatePosition} object.
   *         Rejects with a {aeris.geolocate.errors.GeolocateServiceError} object.
   * @method geolocate
   */
  GeolocateController.prototype.geolocate = function() {
    this.eventHub_.trigger('geolocate:request');

    return this.geolocateService_.getCurrentPosition().
      done(function(res) {
        this.eventHub_.trigger('geolocate:success', res);

        this.setMapPosition_(res.latLon);
      }, this).
      fail(function(err) {
        this.eventHub_.trigger('geolocate:error', err);
      }, this).
      always(function() {
        this.eventHub_.trigger('geolocate:complete');
      }, this);
  };


  /**
   * Sets the map state center to the specified
   * latLon position. If this.zoomTo_ is set,
   * also updates the maps zoom level.
   *
   * @param {aeris.maps.LatLon} latLon
   * @private
   * @method setMapPosition_
   */
  GeolocateController.prototype.setMapPosition_ = function(latLon) {
    var state = {
      center: latLon
    };

    if (!_.isUndefined(this.zoomTo_)) {
      state.zoom = this.zoomTo_;
    }

    this.mapState_.set(state, { validate: true });
  };


  return GeolocateController;
});
