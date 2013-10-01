define([
  'aeris/util',
  'openlayers/utils',
  'base/abstractstrategy'
], function(_, mapUtil, AbstractStrategy) {
  /**
   * @class aeris.maps.openlayers.InfoBoxStrategy
   * @extends aeris.maps.AbstractStrategy
   * @param {aeris.maps.InfoBox} infoBox
   * @constructor
   */
  var InfoBoxStrategy = function(infoBox) {

    /**
     * The infoBox object to render.
     *
     * @type {aeris.maps.InfoBox}
     * @private
     */
    this.infoBox_ = infoBox;

    AbstractStrategy.call(this, infoBox);

    this.infoBox_.on({
      'change:content': this.updateContent_,
      'change:latLon': this.updatePosition_
    }, this);
  };
  _.inherits(InfoBoxStrategy, AbstractStrategy);


  /**
   * @override
   * @return {OpenLayers.Popup.FramedCloud}
   */
  InfoBoxStrategy.prototype.createView_ = function() {
    var onClose = _.bind(function() {
      this.infoBox_.trigger('close');
    }, this);

    return new OpenLayers.Popup.FramedCloud(
      this.infoBox_.get('name'),
      this.getLonLat_(),
      null,                             // content size
      this.infoBox_.get('content'),     // content HTML
      null,                             // Anchor
      true,                             // show close btn
      onClose                           // onClose callback
    );
  };


  /**
   * @override
   */
  InfoBoxStrategy.prototype.setMap = function(aerisMap) {
    AbstractStrategy.prototype.setMap.apply(this, arguments);

    // OpenLayers gets grumpy if you
    // try to add the InfoBox before
    // the map is loaded.
    //
    // This seems like a reasonable workaround.
    aerisMap.once('load', function() {
      this.mapView_.addPopup(this.getView());
    }, this);
  };


  /**
   * @override
   */
  InfoBoxStrategy.prototype.beforeRemove_ = function() {
    this.mapView_.removePopup(this.getView());
  };


  /**
   * Update the view's position
   * to match the infoBox object's latLon
   * attribute.
   *
   * @private
   */
  InfoBoxStrategy.prototype.updatePosition_ = function() {
    this.getView().lonlat = this.getLonLat_();

    if (this.mapView_) {
      this.getView().updatePosition();
    }
  };

  /**
   * Update the view's content
   * to match the infoBox object's content
   * attribute.
   *
   * @private
   */
  InfoBoxStrategy.prototype.updateContent_ = function() {
    var content = this.infoBox_.get('content');

    this.getView().setContentHTML(content);
  };


  /**
   * @return {OpenLayers.LonLat} Position of infoWindow object.
   */
  InfoBoxStrategy.prototype.getLonLat_ = function() {
    return mapUtil.arrayToLonLat(this.infoBox_.get('latLon'));
  };


  return InfoBoxStrategy;
});
