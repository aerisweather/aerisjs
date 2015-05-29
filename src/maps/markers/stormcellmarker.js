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

    // Tornado
    if (properties.ob.tvs > 0 || properties.ob.mda > 10) {
      _.extend(styles.cell, {
        radius: 5,
        fillColor: '#fc0d1b'
      });
    }
    // Hail
    else if (properties.ob.hail && properties.ob.hail.prob >= 70) {
      _.extend(styles.cell, {
        radius: 5,
        fillColor: '#2dfffe'
      });
    }
    // rotating
    else if (properties.ob.mda > 0) {
      _.extend(styles.cell, {
        radius: 5,
        fillColor: '#fecb2f'
      });
    }

    return styles;
  };

  return StormCellMarker;
});
