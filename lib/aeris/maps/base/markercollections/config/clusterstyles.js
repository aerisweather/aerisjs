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
    default: _.map(['green', 'grey', 'yellow'], function(color) {
      return {
        url: config.get('path') + 'assets/marker_' + color + '.png',
        width: 25,
        height: 25,
        textColor: '#ffffff',
        textSize: 13,
        anchorText: [-14, 15]
      }
    })
  });
});
