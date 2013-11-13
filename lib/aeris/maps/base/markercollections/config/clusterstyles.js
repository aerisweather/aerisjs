define([
  'aeris/util',
  'aeris/config',
  'base/markers/config/iconlookup'
], function(_, config, iconLookup) {
  /**
   * Styles configuration for marker clusters.
   *
   * See http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html
   *  "class ClusterIconStyle" for acceptable style options.
   *
   * @class aeris.maps.markercollections.config.clusterStyles
   * @static
   */
  var styles = {};

  // Process iconLookup config
  // to create clusters using the
  // same icons.
  _.each(iconLookup, function(catIconLookup, cat) {
    styles[cat] = {};

    _.each(catIconLookup, function(icon, type) {
      styles[cat][type] = [{
        url: config.get('path') + 'assets/' + icon + '.png',
        width: 25,
        height: 25,
        textColor: '#ffffff',
        textSize: 13,
        anchorText: [-14, 15]
      }]
    })
  });

  return _.extend(styles, {
    default: _.map(['blue', 'green', 'orange', 'red'], function(color) {
      return {
        url: config.get('path') + 'assets/clusters/map_cluster_point_' + color + '_int0.png',
        width: 63,
        height: 63,
        textColor: '#ffffff',
        textSize: 13,
        anchorText: [-14, 15]
      }
    })
  });
});
