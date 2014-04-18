define([
  'aeris/util',
  'aeris/maps/strategy/utils',
  'aeris/maps/strategy/layers/layerstrategy'
], function(_, mapUtil, LayerStrategy) {
  var KMLStrategy = function(layer) {
    LayerStrategy.call(this, layer);
  };
  _.inherits(KMLStrategy, LayerStrategy);


  /**
   * @method createView_
   */
  KMLStrategy.prototype.createView_ = function() {
    return new OpenLayers.Layer.Vector(
      this.object_.get('name'),
      {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
          url: this.object_.get('url'),
          format: new OpenLayers.Format.KML({
            extractStyles: true,
            extractAttributes: true
          })
        })
      }
    );
  };


  /**
   * @method setMap
   */
  KMLStrategy.prototype.setMap = function() {
    var control;

    LayerStrategy.prototype.setMap.apply(this, arguments);


    // Create click events
    control = new OpenLayers.Control.SelectFeature(this.getView());
    this.proxyClickEvent_();
    this.mapView_.addControl(control);
    control.activate();
  };


  /**
   * Trigger a click event on the
   * layer object, when the KML view is clicked.
   * @private
   * @method proxyClickEvent_
   */
  KMLStrategy.prototype.proxyClickEvent_ = function() {
    var handleEvent = function(evt) {
      var lonLat = evt.feature.geometry.getBounds().getCenterLonLat();
      var latLon = mapUtil.lonLatToArray(lonLat);

      var data = _.extend({
        name: '',
        author: '',
        description: '',
        snippet: ''
      }, _.pick(evt.feature.data, [
        'name',
        'author',
        'description',
        'snippet'
      ]));

      this.object_.trigger('click', latLon, data);
    };

    this.getView().events.on({
      'featureselected': _.bind(handleEvent, this)
    });
  };


  return KMLStrategy;
});
