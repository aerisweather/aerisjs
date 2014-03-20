define([
  'aeris/util',
  'aeris/application/controllers/itemcontroller'
], function(_, ItemController) {
  /**
   * Control the map position using
   * search-by-location form.
   *
   * @class GeocodeController
   * @namespace aeris.builder.maps.geosearch.controllers
   * @extends aeris.application.controllers.ItemController
   *
   * @constructor
   * @override
   *
   * @param {aeris.Events} options.eventHub Required.
   * @param {aeris.Model} options.mapState Required.
   * @param {aeris.geocode.AbstractGeocodeService} options.geocodeService Required.
   * @param {?number=} options.zoomTo
  */
  var GeocodeController = function(options) {
    /**
     * Application event hub.
     *
     * @type {aeris.Events}
     * @private
     * @property eventHub_
     */
    this.eventHub_ = options.eventHub;


    /**
     * The application state of the map.
     *
     * @type {aeris.Model}
     * @private
     * @property mapState_
     */
    this.mapState_ = options.mapState;


    /**
     * The service used to geocode
     * a location.
     *
     * @type {aeris.geocode.AbstractGeocodeService}
     * @private
     * @property geocodeService_
     */
    this.geocodeService_ = options.geocodeService;


    /**
     * When geocoding is performed,
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
     * The last geocoded position.
     *
     * @type {?Array.<number>}
     * @private
     * @property lastPosition_
     */
    this.lastPosition_ = this.mapState_.get('center');


    /**
     * Expected ui:
     *
     *  searchInput     The input field specifying the
     *                  location to geocode.
     *
     *  searchForm      The form which, when submitted,
     *                  is requesting a geocode action.
     *
     * @property ui
     * @type {Object}
     */
    options.ui = _.defaults(options.ui || {}, {
      searchInput: '',
      searchForm: ''
    });

    options.events || (options.events = {});
    options.events['submit ' + options.ui.searchForm] = function() {
      this.geocode();
      return false;
    };

    ItemController.apply(this, arguments);
  };
  _.inherits(GeocodeController, ItemController);


  /**
   * @override
   * @method onRender
   */
  GeocodeController.prototype.onRender = function() {
    // Clear the form when the map's
    // location changes
    this.listenTo(this.mapState_, 'change:center', function() {
      if (this.mapState_.get('center') !== this.lastPosition_) {
        this.clearForm();
      }
    });
  };


  /**
   * Geocode the location set in the
   * search input field,
   * then update the map to center/zoom on
   * the returned latLon.
   *
   * @return {aeris.Promise} Resolves with the same arguments
   *                         as aeris.geocode.AbstractGeocodeService#geocode.
   * @method geocode
   */
  GeocodeController.prototype.geocode = function() {
    var location = this.ui.searchInput.val();

    this.eventHub_.trigger('geocode:request', location);

    return this.geocodeService_.geocode(location).
      done(function(res) {
        this.eventHub_.trigger('geocode:success', res, location);

        this.lastPosition_ = res.latLon;
        this.setMapLocation_(res.latLon);
      }, this).
      fail(function(err) {
        this.eventHub_.trigger('geocode:error', err, location);
      }, this).
      always(function() {
        this.eventHub_.trigger('geocode:complete', location);
      }, this);
  };


  /**
   * Clear the geocode search form.
   * @method clearForm
   */
  GeocodeController.prototype.clearForm = function() {
    this.ui.searchInput.val('');
  };



  /**
   * Set the center location of the map.
   * If this.zoomTo_ is set, will also update the
   * zoom level of the map.
   *
   * @param {aeris.maps.LatLon} latLon
   * @private
   * @method setMapLocation_
   */
  GeocodeController.prototype.setMapLocation_ = function(latLon) {
    var state = {
      center: latLon
    };

    if (!_.isUndefined(this.zoomTo_)) {
      state.zoom = this.zoomTo_;
    }

    this.mapState_.set(state, { validate: true });
  };


  return GeocodeController;
});
