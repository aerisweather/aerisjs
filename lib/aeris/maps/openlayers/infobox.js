define([
  'aeris/util',
  'aeris/maps/strategy/utils',
  'aeris/maps/abstractstrategy'
], function(_, mapUtil, AbstractStrategy) {
  /**
   * @class InfoBox
   * @namespace aeris.maps.openlayers
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
     * @property infoBox_
     */
    this.infoBox_ = infoBox;

    AbstractStrategy.call(this, infoBox);

    this.infoBox_.on({
      'change:content': this.updateContent_,
      'change:position': this.updatePosition_
    }, this);
  };
  _.inherits(InfoBoxStrategy, AbstractStrategy);


  /**
   * @override
   * @return {OpenLayers.Popup.FramedCloud}
   * @method createView_
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
   * @method setMap
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
   * @method beforeRemove_
   */
  InfoBoxStrategy.prototype.beforeRemove_ = function() {
    this.mapView_.removePopup(this.getView());
  };


  /**
   * Update the view's position
   * to match the infoBox object's position
   * attribute.
   *
   * @private
   * @method updatePosition_
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
   * @method updateContent_
   */
  InfoBoxStrategy.prototype.updateContent_ = function() {
    var content = this.infoBox_.get('content');

    this.getView().setContentHTML(content);
  };


  /**
   * @return {OpenLayers.LonLat} Position of infoWindow object.
   * @method getLonLat_
   */
  InfoBoxStrategy.prototype.getLonLat_ = function() {
    return mapUtil.arrayToLonLat(this.infoBox_.get('position'));
  };


  return InfoBoxStrategy;
});
