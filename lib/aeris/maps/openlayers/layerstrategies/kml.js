define([
  'aeris/util', 'base/layerstrategy', 'openlayers/layerstrategies/mixins/default',
  'base/layerstrategies/mixins/kml'
], function(_) {

  /**
   * @fileoverview Layer manager strategy for support of KML with OpenLayers.
   */


  _.provide('aeris.maps.openlayers.layerstrategies.KML');


  /**
   * A strategy for support of KML with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   * @extends {aeris.maps.openlayers.layerstrategies.mixins.Default}
   * @extends {aeris.maps.layerstrategies.mixins.KML}
   */
  aeris.maps.openlayers.layerstrategies.KML = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  _.inherits(aeris.maps.openlayers.layerstrategies.KML,
                 aeris.maps.LayerStrategy);
  _.extend(aeris.maps.openlayers.layerstrategies.KML.prototype,
               aeris.maps.openlayers.layerstrategies.mixins.Default);
  _.extend(aeris.maps.openlayers.layerstrategies.KML.prototype,
               aeris.maps.layerstrategies.mixins.KML);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.KML.prototype.createInstanceLayer =
      function(layer) {
    var displayLayer = new OpenLayers.Layer.Vector(layer.name, {
      strategies: [new OpenLayers.Strategy.Fixed()],
      protocol: new OpenLayers.Protocol.HTTP({
        url: layer.url,
        format: new OpenLayers.Format.KML({
          extractStyles: true,
          extractAttributes: true
        })
      })
    });
    var clickLayer = new OpenLayers.Layer.Vector(layer.name, {
      strategies: [new OpenLayers.Strategy.Fixed()],
      protocol: new OpenLayers.Protocol.HTTP({
        url: layer.url,
        format: new OpenLayers.Format.KML()
      })
    });
    return {
      displayLayer: displayLayer,
      clickLayer: clickLayer
    };
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.KML.prototype.registerInstanceLayer =
      function(instanceLayer, map) {
    aeris.maps.openlayers.layerstrategies.mixins.Default.
        registerInstanceLayer.call(this, instanceLayer.displayLayer, map);
    aeris.maps.openlayers.layerstrategies.mixins.Default.
        registerInstanceLayer.call(this, instanceLayer.clickLayer, map);
    this.setLayerOpacity(instanceLayer.clickLayer, 0);
    this.addSelectFeature_(instanceLayer.clickLayer, map);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.KML.prototype.unregisterInstanceLayer =
      function(instanceLayer, map) {
    aeris.maps.openlayers.layerstrategies.mixins.Default.
        unregisterInstanceLayer.call(this, instanceLayer.displayLayer, map);
    aeris.maps.openlayers.layerstrategies.mixins.Default.
        unregisterInstanceLayer.call(this, instanceLayer.clickLayer, map);
  };


  /**
   * Allow individual elements in the KML to be selected and alert a pop-up.
   *
   * @param {Object} instanceLayer The instance layer to add the feature to.
   * @param {Object} map The map to register the feature with.
   * @private
   */
  aeris.maps.openlayers.layerstrategies.KML.prototype.addSelectFeature_ =
      function(instanceLayer, map) {
    var select = new OpenLayers.Control.SelectFeature(instanceLayer);
    instanceLayer.events.on({
      'featureselected': this.onFeatureSelect_(select),
      'featureunselected': this.onFeatureUnselect_()
    });
    map.addControl(select);
    select.activate();
  };


  /**
   * Return a callback function that will be called when a KML element is
   * selected.
   *
   * @param {OpenLayers.Control.SelectFeature} select The SelectFeature used
   *     to add the select feature to the KML.
   * @return {Function}
   * @private
   */
  aeris.maps.openlayers.layerstrategies.KML.prototype.onFeatureSelect_ =
      function(select) {
    var self = this;
    function fn(event) {
      var feature = event.feature
      var content = "<h2>" + feature.attributes.name + "</h2>" +
                    feature.attributes.description;
      var popup = new OpenLayers.Popup.FramedCloud('kml-popup',
        feature.geometry.getBounds().getCenterLonLat(),
        new OpenLayers.Size(100, 100),
        content, null, true, self.onPopupClose_(select));
      feature.popup = popup;
      event.feature.layer.map.addPopup(popup);
    };
    return fn;
  };


  /**
   * Return a callback function that will be called when a KML element is
   * unselected.
   *
   * @return {Function}
   * @private
   */
  aeris.maps.openlayers.layerstrategies.KML.prototype.onFeatureUnselect_ =
      function() {
    function fn(event) {
      var feature = event.feature;
      if (feature.popup) {
        feature.layer.map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
      }
    };
    return fn;
  };


  /**
   * Return a callback function that closes all pop-ups for a given
   * SelectFeature.
   *
   * @param {OpenLayers.Control.SelectFeature} select The SelectFeature to have
   *     pop-ups closed.
   * @return {Function}
   * @private
   */
  aeris.maps.openlayers.layerstrategies.KML.prototype.onPopupClose_ =
      function(select) {
    function fn() {
      select.unselectAll();
    };
    return fn;
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.KML.prototype.setLayerZIndex =
      function(instanceLayer, zIndex) {
    instanceLayer = instanceLayer.displayLayer || instanceLayer;
    aeris.maps.openlayers.layerstrategies.mixins.Default.setLayerZIndex.
        call(this, instanceLayer, zIndex);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.KML.prototype.setLayerOpacity =
      function(instanceLayer, opacity) {
    instanceLayer = instanceLayer.displayLayer || instanceLayer;
    aeris.maps.openlayers.layerstrategies.mixins.Default.setLayerOpacity.
        call(this, instanceLayer, opacity);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.KML.prototype.showLayer =
      function(instanceLayer) {
    if (instanceLayer.displayLayer) {
      aeris.maps.openlayers.layerstrategies.mixins.Default.showLayer.
        call(this, instanceLayer.displayLayer);
      aeris.maps.openlayers.layerstrategies.mixins.Default.showLayer.
        call(this, instanceLayer.clickLayer);
    } else {
      aeris.maps.openlayers.layerstrategies.mixins.Default.showLayer.
        call(this, instanceLayer);
    }
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.KML.prototype.hideLayer =
      function(instanceLayer) {
    if (instanceLayer.displayLayer) {
      aeris.maps.openlayers.layerstrategies.mixins.Default.hideLayer.
        call(this, instanceLayer.displayLayer);
      aeris.maps.openlayers.layerstrategies.mixins.Default.hideLayer.
        call(this, instanceLayer.clickLayer);
    } else {
      aeris.maps.openlayers.layerstrategies.mixins.Default.hideLayer.
        call(this, instanceLayer);
    }
  };


  return aeris.maps.openlayers.layerstrategies.KML;

});
