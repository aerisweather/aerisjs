define([
  'aeris/util',
  'aeris/config',
  'aeris/maps/markers/config/iconlookup'
], function(_, config, iconLookup) {
  var styles = {};
  /**
   * Styles configuration for marker clusters.
   *
   * See http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html
   *  "class ClusterIconStyle" for acceptable style options.
   *
   * @class clusterStyles
   * @namespace aeris.maps.markercollections.config
   * @static
   */

  // Process iconLookup config
  // to create clusters using the
  // same icons.
  _.each(iconLookup, function(catIconLookup, cat) {
    styles[cat] = {};

    _.each(catIconLookup, function(icon, type) {
      styles[cat][type] = [{
        url: config.get('assetPath') + icon + '.png',
        width: 25,
        height: 25,
        textColor: '#ffffff',
        textSize: 13,
        anchorText: [-14, 15]
      }];
    });
  });

  return _.extend(styles, {
    defaultStyles: _.map(['green', 'grey', 'yellow'], function(color) {
      return {
        url: config.get('assetPath') + 'marker_' + color + '.png',
        width: 25,
        height: 25,
        textColor: '#ffffff',
        textSize: 13,
        anchorText: [-14, 15]
      };
    })
  });
});
