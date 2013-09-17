define([
  'aeris/util', 'base/layerstrategy', 'openlayers/layerstrategies/mixins/default', 'aeris/jsonp',
  'aeris/promise'
], function(_) {

  /**
   * @fileoverview Layer strategy for supporting Aeris Polygons layer with OL.
   */


  _.provide('aeris.maps.openlayers.layerstrategies.AerisPolygons');


  /**
   * A strategy for supporting Aeris Polygons with OpenLayers.
   *
   * @constructor
   * @class aeris.maps.openlayers.layerstrategies.AerisPolygons
   * @extends {aeris.maps.LayerStrategy}
   * @extends {aeris.maps.openlayers.layerstrategies.mixins.Default}
   */
  aeris.maps.openlayers.layerstrategies.AerisPolygons = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  _.inherits(aeris.maps.openlayers.layerstrategies.AerisPolygons,
                 aeris.maps.LayerStrategy);
  _.extend(aeris.maps.openlayers.layerstrategies.AerisPolygons.prototype,
               aeris.maps.openlayers.layerstrategies.mixins.Default);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisPolygons.prototype.
      createInstanceLayer = function(layer) {
    var promise = new aeris.Promise();
    var url = 'http://gis.hamweather.net/json/' + layer.aerisPolygonType + '_decoded.json';
    aeris.jsonp.get(url, null, function(data) {
      var polygonFeatures = [];
      var groups = data.groups;
      for (var i = 0, length = groups.length; i < length; i++) {
        var group = groups[i];
        for (var j = 0, jlen = group.polygons.length; j < jlen; j++) {
          var polyline = group.polygons[j].points;
          var points = [];
          for (var k = 0, klen = polyline.length; k < klen; k++) {
            var point = polyline[k];
            point = new OpenLayers.Geometry.Point(point[1], point[0]);
            point.transform(new OpenLayers.Projection('EPSG:4326'),
                          new OpenLayers.Projection('EPSG:900913'));
            points.push(point);
          }
          var ring = new OpenLayers.Geometry.LinearRing(points);
          var polygonFeature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Polygon([ring]),
            null, layer.styles[group.value]);
          polygonFeatures.push(polygonFeature);
        }
      }
      var polygon = new OpenLayers.Layer.Vector('aerisPolygons');
      polygon.addFeatures(polygonFeatures);
      promise.resolve(polygon);
    }, 'C');
    return promise;
  };


  /**
   * @override
   *
   */
  aeris.maps.openlayers.layerstrategies.AerisPolygons.prototype.
      registerInstanceLayer = function(instanceLayer, map) {
    instanceLayer.done(function(polygon) {
      aeris.maps.openlayers.layerstrategies.mixins.Default.
          registerInstanceLayer.call(this, polygon, map);
    });
  };


  /**
   * @override
   *
   */
  aeris.maps.openlayers.layerstrategies.AerisPolygons.prototype.
      unregisterInstanceLayer = function(instanceLayer, map) {
    instanceLayer.done(function(polygon) {
      aeris.maps.openlayers.layerstrategies.mixins.Default.
          unregisterInstanceLayer.call(this, polygon, map);
    });
  };


  /**
   * @override
   *
   */
  aeris.maps.openlayers.layerstrategies.AerisPolygons.prototype.
      setLayerZIndex = function(instanceLayer, zIndex) {
    instanceLayer.done(function(polygon) {
      aeris.maps.openlayers.layerstrategies.mixins.Default.
          setLayerZIndex.call(this, polygon, zIndex);
    });
  };


  /**
   * @override
   *
   */
  aeris.maps.openlayers.layerstrategies.AerisPolygons.prototype.
      showLayer = function(instanceLayer) {
    instanceLayer.done(function(polygon) {
      aeris.maps.openlayers.layerstrategies.mixins.Default.
          showLayer.call(this, polygon);
    });
  };


  /**
   * @override
   *
   */
  aeris.maps.openlayers.layerstrategies.AerisPolygons.prototype.
      hideLayer = function(instanceLayer) {
    instanceLayer.done(function(polygon) {
      aeris.maps.openlayers.layerstrategies.mixins.Default.
          hideLayer.call(this, polygon);
    });
  };


  /**
   * @override
   *
   */
  aeris.maps.openlayers.layerstrategies.AerisPolygons.prototype.
      setLayerOpacity = function(instanceLayer, opacity) {
    instanceLayer.done(function(polygon) {
      aeris.maps.openlayers.layerstrategies.mixins.Default.
          setLayerOpacity.call(this, polygon, opacity);
    });
  };


  return aeris.maps.openlayers.layerstrategies.AerisPolygons;

});
