define([
  'aeris/util',
  'aeris/config',
  'aeris/maps/markers/config/iconlookup'
], function(_, config, markerIconLookup) {
  /**
   * Styles configuration for marker clusters.
   *
   * See http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html
   *  "class ClusterIconStyle" for acceptable style options.
   *
   * @class aeris.maps.markercollections.config.clusterStyles
   * @static
   */
  var clusterStyles = {};

  _.each(markerIconLookup, function(markerClassStyles, markerClassName) {
    clusterStyles[markerClassName] = clusterStylesFromMarkerStyles(markerClassStyles);
  });

  clusterStyles.defaultStyles = _.map([
    'marker_green.png',
    'marker_grey.png',
    'marker_yellow.png'
  ], function(markerUrl) {
    return {
      url: config.get('assetPath') + markerUrl,
      width: 18,
      height: 18,
      offsetX: 9,
      offsetY: 9,
      textColor: '#ffffff',
      textSize: 13,
      anchorText: [-14, 15]
    };
  });

  return clusterStyles;


  /**
   * Convert marker styles to markerCluster styles.
   * Basically, just wraps a array around the styles --
   * our MarkerClusterers expect an array of styles, to be used
   * depending on the cluster count. But we're currently using the
   * same icon, no matter what the count.
   *
   markerStyles: {
      typeA: {
        url: '',
        offsetX: 12,
        offsetY: 34
      },
      typeB: {...}
   }

   clusterStyles: {
     typeA: [{
        url: '',
        offsetX: 12,
        offsetY: 34
     }],
     typeB: [{...}]
   }

   */
  function clusterStylesFromMarkerStyles(markerStyles) {
    var clusterStyles = _.clone(markerStyles);
    var defaultClusterStyles = {
      textColor: '#ffffff',
      textSize: 13,
      anchorText: [-14, 15]
    };

    // Wrap type configs in array
    _.each(clusterStyles, function(typeConfig, typeName) {
      clusterStyles[typeName] = [_.defaults({}, typeConfig, defaultClusterStyles)];
    });

    return clusterStyles;
  }
});
