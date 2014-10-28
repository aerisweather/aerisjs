define([
  'aeris/util',
  'aeris/config'
], function(_, config) {
  /**
   * Lookup objects to match a
   * marker type to its icon file name.
   *
   * @property aeris.maps.markers.config.iconLookup
   * @static
   */
  var stormReportDefaults = {
    offsetX: 12,
    offsetY: 11,
    width: 25,
    height: 25
  };
  var lightningDefaults = {
    offsetX: 8,
    offsetY: 17,
    width: 15,
    height: 34,
    anchorText: [-17, 10]
  };

  function stormRepStyles(styles) {
    var stormReportMarkerDefaults = {
      offsetX: 12,
      offsetY: 11,
      width: 25,
      height: 25
    };
    return _.extend(stormReportMarkerDefaults, styles);
  }

  function lightningStyles(styles) {

  }

  return {
    stormReport: {
      avalanche: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_avalanche.png'
      }, stormReportDefaults),
      blizzard: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_snow.png'
      }, stormReportDefaults),
      sleet: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_ice.png'
      }, stormReportDefaults),
      flood: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_flood.png'
      }, stormReportDefaults),
      fog: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_densefog.png'
      }, stormReportDefaults),
      ice: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_ice.png'
      }, stormReportDefaults),
      hail: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_hail.png'
      }, stormReportDefaults),
      lightning: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_lightning.png'
      }, stormReportDefaults),
      rain: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_rain.png'
      }, stormReportDefaults),
      snow: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_snow.png'
      }, stormReportDefaults),
      tides: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_highsurf.png'
      }, stormReportDefaults),
      spout: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_tornado.png'
      }, stormReportDefaults),
      tornado: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_tornado.png'
      }, stormReportDefaults),
      // as in, funnel cloud
      funnel: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_tornado.png'
      }, stormReportDefaults),
      wind: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_highwind.png'
      }, stormReportDefaults),
      downburst: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_highwind.png'
      }, stormReportDefaults),
      winds: _.defaults({
        url: config.get('assetPath') + 'stormrep_marker_highwind.png'
      }, stormReportDefaults)
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
      // by how old the lightning report is,
      // in minutes.
      // Up to 15 minutes old
      15: _.defaults({
        url: config.get('assetPath') + 'lightning_white.png'
      }, lightningDefaults),
      // Up to 30 minutes old
      30: _.defaults({
        url: config.get('assetPath') + 'lightning_yellow.png'
      }, lightningDefaults),
      // Up to 45 minutes old
      45: _.defaults({
        url: config.get('assetPath') + 'lightning_red.png'
      }, lightningDefaults),
      // Up to 60 minutes old
      60: _.defaults({
        url: config.get('assetPath') + 'lightning_orange.png'
      }, lightningDefaults),
      // Up to 99999 minutes old (catch-all)
      99999: _.defaults({
        url: config.get('assetPath') + 'lightning_blue.png'
      }, lightningDefaults)
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

