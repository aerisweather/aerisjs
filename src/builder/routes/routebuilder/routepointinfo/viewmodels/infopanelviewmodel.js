define([
  'aeris/util',
  'aeris/viewmodel'
], function(_, ViewModel) {
  /**
   * @class InfoPanelViewModel
   * @namespace aeris.builder.routes.routebuilder.routepointinfo.viewmodels
   * @extends aeris.ViewModel
   *
   * @constructor
   * @override
   *
   * @param {aeris.gmaps.route.Waypoint} opt_options.data
  */
  var InfoPanelViewModel = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      attributeTransforms: {
        lat: this.lookupLat_,
        lon: this.lookupLon_,
        latDirection: this.lookupLatDirection_,
        lonDirection: this.lookupLonDirection_,
        distanceToNext: this.lookupDistanceToNext_,
        distanceFromPrev: this.lookupDistanceFromPrev_
      }
    });

    /**
     * @property data_
     * @type {aeris.maps.gmaps.route.Waypoint}
     * @private
     */

    /**
     * @attribute {number} lat
     */
    /**
     * @attribute {number} lon
     */
    /**
     * @attribute {number} distanceToNext
     */
    /**
     * @attribute {number} distanceFromPrev
     */

    ViewModel.call(this, opt_attrs, options);
  };
  _.inherits(InfoPanelViewModel, ViewModel);


  /**
   * @private
   * @method lookupLat_
   */
  InfoPanelViewModel.prototype.lookupLat_ = function() {
    var position = this.getDataAttribute('position');

    return position ? position[0].toFixed(2) : null;
  };


   /**
    * @private
   * @method lookupLon_
   */
  InfoPanelViewModel.prototype.lookupLon_ = function() {
    var position = this.getDataAttribute('position');

    return position ? position[1].toFixed(2) : null;
  };


  InfoPanelViewModel.prototype.lookupLatDirection_ = function() {
    var isNorth = (this.lookupLat_() >= 0);

    return isNorth ? 'N' : 'S';
  };


  InfoPanelViewModel.prototype.lookupLonDirection_ = function() {
    var isEast = (this.lookupLon_() >= 0);

    return isEast ? 'E' : 'W';
  };


   /**
    * @private
   * @method lookupDistanceToNext_
   */
  InfoPanelViewModel.prototype.lookupDistanceToNext_ = function() {
    var next = this.getNextRoutePoint_();

    return next ? this.createDistanceObject_(next.get('distance')) : null;
  };


  /**
   * @private
   * @method lookupDistanceFromPrev_
   */
  InfoPanelViewModel.prototype.lookupDistanceFromPrev_ = function() {
    var meters = this.getDataAttribute('distance');
    return meters ? this.createDistanceObject_(meters) : null;
  };


  InfoPanelViewModel.prototype.createDistanceObject_ = function(distanceInMeters) {
    var distanceInKM = distanceInMeters / 1000;
    return {
      miles: this.metersToMilesString_(distanceInMeters),
      km: distanceInKM.toFixed(1)
    };
  };


  /**
   * @private
   * @method getNextRoutePoint_
   */
  InfoPanelViewModel.prototype.getNextRoutePoint_ = function() {
    if (!this.isRoutePointInRoute_()) { return undefined; }

    return this.getData().getNextInRoute();
  };


  InfoPanelViewModel.prototype.isRoutePointInRoute_ = function() {
    return !!this.getData().getRoute();
  };


  InfoPanelViewModel.prototype.metersToMiles_ = function(meters) {
    var METERS_PER_MILE = 1609.34;

    return (meters / METERS_PER_MILE);
  };

  InfoPanelViewModel.prototype.metersToMilesString_ = function(meters) {
    return this.metersToMiles_(meters).toFixed(1);
  };



  return InfoPanelViewModel;
});
