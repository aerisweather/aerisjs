define([
  'aeris/config'
], function(config) {
  /**
   * Styles configuration for marker clusters.
   *
   * See http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html
   *  "class ClusterIconStyle" for acceptable style options.
   *
   * @class aeris.maps.markercollections.config.clusterStyles
   * @static
   */
  return {
    default: _.map(['blue', 'green', 'orange', 'red'], function(color) {
      return {
        url: config.get('path') + 'assets/clusters/map_cluster_point_' + color + '.png',
        width: 63,
        height: 63
      }
    })
  }
});
