define([
  'aeris/util',
  'aeris/viewmodel'
], function(_, ViewModel) {
  /**
   * @class aeris.builder.routes.routebuilder.routepointinfo.viewmodel.InfoPanelViewModel
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

    /** @attribute {number} lat */
    /** @attribute {number} lon */
    /** @attribute {number} distanceToNext */
    /** @attribute {number} distanceFromPrev */

    ViewModel.call(this, opt_attrs, options);
  };
  _.inherits(InfoPanelViewModel, ViewModel);


  /** @private */
  InfoPanelViewModel.prototype.lookupLat_ = function() {
    var position = this.getDataAttribute('position');

    return position ? position[0].toFixed(2) : null;
  };


   /** @private */
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


   /** @private */
  InfoPanelViewModel.prototype.lookupDistanceToNext_ = function() {
    var next = this.getNextRoutePoint_();

    return next ? next.get('distance').toFixed(2) : null;
  };


  /** @private */
  InfoPanelViewModel.prototype.lookupDistanceFromPrev_ = function() {
    var distance = this.getDataAttribute('distance');
    return distance ? distance.toFixed(2) : null;
  };


  /** @private */
  InfoPanelViewModel.prototype.getNextRoutePoint_ = function() {
    return this.getData().getNextInRoute();
  };


  /** @private */
  InfoPanelViewModel.prototype.getPreviousRoutePoint_ = function() {
    return this.getData().getPreviousInRoute();
  };


  InfoPanelViewModel.prototype.setRoutePoint = function(routePoint) {
    this.data_.reset(routePoint.toJSON());
  };



  return InfoPanelViewModel;
});
