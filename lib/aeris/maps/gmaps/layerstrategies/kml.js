define([
  'aeris/util',
  'gmaps/utils',
  'gmaps/abstractstrategy'
], function(_, mapUtil, BaseStrategy) {
  /**
   * KML Layer Strategy for the Google Maps API.
   *
   * @override
   * @constructor
   * @class aeris.maps.gmaps.layerstrategies.KMLLayerStrategy
   * @extends aeris.maps.gmaps.AbstractStrategy
   */
  var KmlLayerStrategy = function() {
    BaseStrategy.apply(this, arguments);


    this.googleEvents_.listenTo(this.getView(), {
      'click': function(evt) {
        var latLon = mapUtil.latLngToArray(evt.latLng);
        var data = _.extend({
          name: '',
          author: '',
          description: '',
          snipped: ''
        }, _.pick(evt.featureData, [
          'name',
          'author',
          'description',
          'snippet'
        ]));
        this.object_.trigger('click', latLon, data);
      }
    }, this);
  };

  _.inherits(KmlLayerStrategy, BaseStrategy);


  /**
   * @override
   */
  KmlLayerStrategy.prototype.createView_ = function() {
    var layerOptions = this.getOptions_();

    return new google.maps.KmlLayer(layerOptions);
  };


  /**
   * Returns KML layer data url
   * @private
   */
  KmlLayerStrategy.prototype.getUrl_ = function() {
    var now = new Date();
    return this.object_.get('url') + '?' +
      now.getHours().toString() +
      now.getMinutes().toString();
  };


  /**
   * Return options for constructing
   * a {google.maps.KmlLayer}.
   * @private
   */
  KmlLayerStrategy.prototype.getOptions_ = function() {
    return {
      url: this.getUrl_(),
      preserveViewport: true,
      suppressInfoWindows: true
    };
  };


  /**
   * @override
   */
  KmlLayerStrategy.prototype.setMap = function(aerisMap) {
    BaseStrategy.prototype.setMap.apply(this, arguments);

    this.getView().setMap(this.mapView_);
  };


  /**
   * @override
   */
  KmlLayerStrategy.prototype.beforeRemove_ = function() {
    this.getView().setMap(null);
  };


  return KmlLayerStrategy;
});
