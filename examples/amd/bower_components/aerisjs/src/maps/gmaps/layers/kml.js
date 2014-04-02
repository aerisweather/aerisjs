define([
  'aeris/util',
  'aeris/maps/strategy/utils',
  'aeris/maps/strategy/abstractstrategy',
  'googlemaps!'
], function(_, mapUtil, BaseStrategy, gmaps) {
  /**
   * KML Layer Strategy for the Google Maps API.
   *
   * @override
   * @constructor
   * @class KMLLayerStrategy
   * @namespace aeris.maps.gmaps.layers
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
   * @method createView_
   */
  KmlLayerStrategy.prototype.createView_ = function() {
    var layerOptions = this.getOptions_();

    return new gmaps.KmlLayer(layerOptions);
  };


  /**
   * Returns KML layer data url
   * @private
   * @method getUrl_
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
   * @method getOptions_
   */
  KmlLayerStrategy.prototype.getOptions_ = function() {
    return {
      url: this.getUrl_(),
      preserveViewport: true,
      suppressInfoWindows: true
    };
  };


  /**
   * @method setMap
   */
  KmlLayerStrategy.prototype.setMap = function(aerisMap) {
    BaseStrategy.prototype.setMap.apply(this, arguments);

    this.getView().setMap(this.mapView_);
  };


  /**
   * @method beforeRemove_
   */
  KmlLayerStrategy.prototype.beforeRemove_ = function() {
    this.getView().setMap(null);
  };


  return KmlLayerStrategy;
});
