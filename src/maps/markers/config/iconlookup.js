define([
  'aeris/util',
  'aeris/config'
], function(_, config) {
  /**
   * Lookup objects to match a
   * marker type to its icon file name.
   *
   * @class iconLookup
   * @namespace aeris.maps.markers.config
   * @static
   */

  function stormRepStyles(styles) {
    var stormReportMarkerDefaults = {
      offsetX: 12,
      offsetY: 11,
      width: 25,
      height: 25
    };
    return _.extend(stormReportMarkerDefaults, styles);
  }

  return {
    stormReport: {
      avalanche: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_avalanche.png'
      }),
      blizzard: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_snow.png'
      }),
      sleet: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_ice.png'
      }),
      flood: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_flood.png'
      }),
      fog: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_densefog.png'
      }),
      ice: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_ice.png'
      }),
      hail: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_hail.png'
      }),
      lightning: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_lightning.png'
      }),
      rain: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_rain.png'
      }),
      snow: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_snow.png'
      }),
      tides: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_highsurf.png'
      }),
      spout: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_tornado.png'
      }),
      tornado: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_tornado.png'
      }),
      // as in, funnel cloud
      funnel: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_tornado.png'
      }),
      wind: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_highwind.png'
      }),
      downburst: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_highwind.png'
      }),
      winds: stormRepStyles({
        url: config.get('assetPath') + 'stormrep_marker_highwind.png'
      })
    },
    earthquake: {
      mini: {
        url: config.get('assetPath') + 'quake_mini.png',
        offsetX: 8,
        offsetY: 9,
        width: 18,
        height: 18,
        anchorText: [-9, 12]
      },
      shallow: {
        url: config.get('assetPath') + 'quake_mini.png',
        offsetX: 8,
        offsetY: 9,
        width: 18,
        height: 18,
        anchorText: [-9, 12]
      },
      minor: {
        url: config.get('assetPath') + 'quake_minor.png',
        offsetX: 14,
        offsetY: 15,
        width: 31,
        height: 31,
        anchorText: [-16, 18]
      },
      light: {
        url: config.get('assetPath') + 'quake_light.png',
        offsetX: 21,
        offsetY: 22,
        width: 45,
        height: 44
      },
      moderate: {
        url: config.get('assetPath') + 'quake_moderate.png',
        offsetX: 28,
        offsetY: 29,
        width: 58,
        height: 58
      },
      strong: {
        url: config.get('assetPath') + 'quake_strong.png',
        offsetX: 42,
        offsetY: 43,
        width: 86,
        height: 86
      },
      major: {
        url: config.get('assetPath') + 'quake_major.png',
        offsetX: 49,
        offsetY: 50,
        width: 100,
        height: 100
      },
      great: {
        url: config.get('assetPath') + 'quake_great.png',
        offsetX: 49,
        offsetY: 50,
        width: 100,
        height: 100
      }
    },
    lightning: {
      defaultStyles: {
        url: config.get('assetPath') + 'lightning_yellow.png',
        offsetX: 8,
        offsetY: 17,
        width: 15,
        height: 34,
        anchorText: [-17, 10]
      }
    },
    fire: {
      defaultStyles: {
        url: config.get('assetPath') + 'map_fire_marker.png',
        offsetX: 13,
        offsetY: 33,
        width: 27,
        height: 38,
        anchorText: [-19, 16]
      }
    }
  };
});

