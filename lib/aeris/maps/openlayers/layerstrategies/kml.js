define([
  'aeris/util',
  'openlayers/utils',
  'strategy/layerstrategies/abstractlayerstrategy'
], function(_, mapUtil, AbstractLayerStrategy) {
  var KMLStrategy = function(layer) {
    AbstractLayerStrategy.call(this, layer);
  };
  _.inherits(KMLStrategy, AbstractLayerStrategy);


  /**
   * @override
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
   * @override
   */
  KMLStrategy.prototype.setMap = function() {
    var control;

    AbstractLayerStrategy.prototype.setMap.apply(this, arguments);


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
