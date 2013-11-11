define([
  'aeris/util',
  'gmaps/utils',
  'gmaps/abstractstrategy'
], function(_, mapUtil, BaseStrategy) {
  /**
   * Strategy for rendering a InfoBox
   * on a google map.
   *
   * @param {aeris.maps.InfoBox} infoBox
   *
   * @class aeris.maps.gmaps.InfoBoxStrategy
   * @extends aeris.maps.gmaps.AbstractStrategy
   * @constructor
   */
  var InfoBoxStrategy = function(infoBox) {
    /**
     * The {aeris.maps.InfoBox} object associated with
     * this strategy.
     *
     * @type {aeris.maps.InfoBox}
     * @private
     */
    this.infoBox_ = infoBox;

    BaseStrategy.apply(this, arguments);

    this.listenTo(this.infoBox_, {
      'change:latLon': this.setPosition,
      'change:content': this.setContent_
    });
  };

  _.inherits(InfoBoxStrategy, BaseStrategy);


  InfoBoxStrategy.prototype.createView_ = function() {
    return new google.maps.InfoWindow(this.getOptions_());
  };


  InfoBoxStrategy.prototype.getOptions_ = function() {
    return {
      content: this.infoBox_.get('content'),
      position: mapUtil.arrayToLatLng(this.infoBox_.get('latLon'))
    };
  };


  InfoBoxStrategy.prototype.setMap = function(aerisMap) {
    BaseStrategy.prototype.setMap.apply(this, arguments);

    this.getView().open(this.mapView_);
    this.proxyViewEvents_();
  };


  InfoBoxStrategy.prototype.setPosition = function() {
    var latLng = mapUtil.arrayToLatLng(this.infoBox_.get('latLon'));
    this.getView().setPosition(latLng);
  };


  InfoBoxStrategy.prototype.setContent_ = function() {
    var content = this.infoBox_.get('content');
    this.getView().setContent(content);
  };


  InfoBoxStrategy.prototype.beforeRemove_ = function() {
    this.getView().close();
    this.infoBox_.trigger('close');

    this.googleEvents_.stopListening(this.getView());
  };


  /**
   * Proxy map events from the google maps marker view
   * over to the Aeris maps marker view,
   * so that the Marker object triggers its own events.
   *
   * @private
   */
  InfoBoxStrategy.prototype.proxyViewEvents_ = function() {
    // Maps the names of google events to aeris Marker events
    var eventMap = {
      'closeclick': 'close'
    };

    // Proxy map events from the google maps marker view
    // over to the Aeris maps marker view,
    // so that the Marker object triggers its own events.
    _.each(eventMap, function(aerisEvent, googleEvent) {
      this.googleEvents_.listenTo(this.getView(), googleEvent, function() {
        this.infoBox_.trigger(aerisEvent);
      }, this);
    }, this);
  };


  return InfoBoxStrategy;
});
