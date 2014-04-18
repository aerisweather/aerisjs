define([
  'aeris/util',
  'aeris/maps/abstractstrategy',
  'leaflet'
], function(_, AbstractStrategy, Leaflet) {
  /**
   * Strategy for rendering a tile layer
   * using Leaflet.
   *
   * @class Tile
   * @namespace aeris.maps.leaflet.layers
   * @extends aeris.maps.strategy.AbstractStrategy
   *
   * @constructor
   */
  var Tile = function(mapObject) {
    AbstractStrategy.call(this, mapObject);

    this.proxyLoadEvents_();
    this.bindLayerAttributes_();
  };
  _.inherits(Tile, AbstractStrategy);


  /**
   * @method createView_
   * @private
   */
  Tile.prototype.createView_ = function() {
    var tileLayer = new Leaflet.TileLayer(this.getTileUrl_(), {
      subdomains: this.object_.get('subdomains'),
      minZoom: this.object_.get('minZoom'),
      maxZoom: this.object_.get('maxZoom'),
      opacity: this.object_.get('opacity'),
      zIndex: this.object_.get('zIndex'),
      attribution: this.getOSMAttribution_()
    });

    return tileLayer;
  };


  /**
   * @method setMap
   */
  Tile.prototype.setMap = function(map) {
    AbstractStrategy.prototype.setMap.call(this, map);

    this.view_.addTo(map.getView());
  };


  /**
   * @method beforeRemove
   */
  Tile.prototype.beforeRemove_ = function() {
    this.mapView_.removeLayer(this.view_);
  };


  /**
   * Returns the tile layer url pattern,
   * formatted for Leaflet.
   *
   * @method getTileUrl_
   * @private
   * @return {string}
   */
  Tile.prototype.getTileUrl_ = function() {
    return this.object_.getUrl().
      replace('{d}', '{s}');
  };


  /**
   * @method getOSMAttribution_
   * @private
   * @return {string}
   */
  Tile.prototype.getOSMAttribution_ = function() {
    return '<a href="http://www.openstreetmap.org/copyright" target="_blank">' +
      '&copy OpenStreetMap contributors' +
      '</a>';
  };


  /**
   * @method proxyLoadEvents_
   * @private
   */
  Tile.prototype.proxyLoadEvents_ = function() {
    var mapLoadResetEvents = {
      moveend: function() {
        this.object_.trigger('load:reset');
      }
    };
    var bindMapLoadResetEvents = (function() {
      var mapView = this.mapView_;

      this.mapView_.addEventListener(mapLoadResetEvents, this);

      this.once('map:remove', function() {
        mapView.removeEventListener(mapLoadResetEvents, this);
      });
    }).bind(this);


    this.view_.addEventListener({
      load: function() {
        this.object_.trigger('load');
      }
    }, this);

    // Tiles loading is reset whenever map moves
    this.listenTo(this.object_, {
      'map:set': bindMapLoadResetEvents
    });

    if (this.object_.hasMap()) {
      bindMapLoadResetEvents();
    }
  };


  /**
   * @method bindLayerAttributes_
   * @private
   */
  Tile.prototype.bindLayerAttributes_ = function() {
    this.listenTo(this.object_, {
      'change:opacity': function() {
        this.view_.setOpacity(this.object_.get('opacity'));
      },
      'change:zIndex': function() {
        this.view_.setZIndex(this.object_.get('zIndex'));
      }
    });
  };


  return Tile;
});
