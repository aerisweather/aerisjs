define([
  'aeris/util',
  'aeris/maps/extensions/mapextensionobject',
  'aeris/maps/strategy/markers/stormcells'
], function(_, MapExtensionObject, StormCellStrategy) {
  /** @class StormCellMarker */
  var StormCellMarker = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      strategy: StormCellStrategy,
      style: this.getStyleDefault_.bind(this)
    });

    this.getStyle = _.isFunction(options.style) ? options.style : _.constant(options.style);

    MapExtensionObject.call(this, opt_attrs, options);
  };
  _.inherits(StormCellMarker, MapExtensionObject);


  StormCellMarker.prototype.toGeoJson = function() {
    return this.getData().toJSON();
  };

  StormCellMarker.prototype.getStyleDefault_ = function(properties) {
    var styles = {
      cell: {
        radius: 4,
        fillColor: '#3bca24',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        hover: {
          radius: 7,
          fillOpacity: 1
        }
      },
      cone: {
        stroke: true,
        color: '#030303',
        weight: 1,
        opacity: 0.8,
        fillColor: '#f66',
        fillOpacity: 0.2,
        hover: {
          weight: 2,
          fillOpacity: 0.8,
          fillColor: '#f66'
        }
      },
      line: {
        stroke: true,
        color: '#030303',
        weight: 1,
        opacity: 0.8,
        hover: {}
      }
    };
    var typeStyles = {
      tornado: {
        radius: 5,
          fillColor: 'red'
      },
      hail: {
        radius: 5,
        fillColor: 'yellow'
      },
      rotating: {
        radius: 5,
        fillColor: 'orange'
      }
    };
    var type = _.path('traits.type', properties);

    if (typeStyles[type]) {
      _.extend(styles.cell, typeStyles[type]);
    }

    return styles;
  };

  return StormCellMarker;
});
