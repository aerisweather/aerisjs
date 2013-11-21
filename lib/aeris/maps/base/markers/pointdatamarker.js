define([
  'aeris/util',
  'base/marker',
  'aeris/config'
], function(_, Marker, config) {
  /**
   * A marker MapExtensionObject which is a view
   * model for a {aeris.api.model.PointData} data model.
   *
   * @class aeris.maps.markers.PointDataMarker
   * @extends aeris.maps.Marker
   *
   * @constructor
   * @override
  */
  var PointDataMarker = function(opt_attrs, opt_options) {
    var options = _.extend({
      iconPath: config.get('path') + 'assets/{name}.png',
      iconLookup: {},
      typeAttribute: '',

      attributeTransforms: {
        url: this.lookupUrl_,
        title: this.getTitleFromData_,
        position: function() {
          return this.getDataAttribute('latLon');
        },
        type: this.lookupType_
      }

    }, opt_options);


    /**
     * The type category this marker belongs
     * to. Useful organizing markers which
     * match some filter.
     *
     * @attribute type
     * @type {string}
     */


    /**
     * The path to a icon url, where {name}
     * is the name of the icon defined in this.iconLookup_
     *
     * @type {string}
     * @private
     */
    this.iconPath_ = options.iconPath;


    /**
     * An object to lookup a marker's icon
     * url by it's type.
     *
     * eg: { blizzard: 'storm/icon_blizzard_sm', snow: 'stormicon_snow_sm' }
     *
     * @type {*|{}}
     * @private
     */
    this.iconLookup_ = options.iconLookup;


    /**
     * The data attribute used to categorize the marker.
     *
     * Defined as a '.' delimited string.
     * eg. 'weather.type' would map to this.get('data').get('weather').type;
     *
     * @type {*|string}
     * @private
     */
    this.typeAttribute_ = options.typeAttribute;


    Marker.call(this, opt_attrs, options);
  };
  _.inherits(PointDataMarker, Marker);


  /**
   * @return {string}
   */
  PointDataMarker.prototype.getType = function() {
    return this.get('type');
  };


  /**
   * Lookup the marker type.
   *
   * @returns {string}
   * @protected
   */
  PointDataMarker.prototype.lookupType_ = function() {
    var type = this.getDataAttribute(this.typeAttribute_);
    var match;

    // For multiple types
    // find one with a matching partner
    // in the iconLookup object.
    if (_.isArray(type)) {
      _.each(type, function(singleType) {
        if (_.has(this.iconLookup_, singleType)) {
          match = singleType;
        }
      }, this);

      return match || this.get('type');
    }

    return type || this.get('type');
  };


  /**
   * Lookup the icon url.
   *
   * @returns {string}
   * @protected
   */
  PointDataMarker.prototype.lookupUrl_ = function() {
    var url;
    var type = this.getType() || this.lookupType_();
    var iconName = this.lookupTypeIcon_(type);

    // If no icon name found,
    // don't try to set one.
    if (!iconName) { return this.get('url'); }

    url = this.iconPath_.replace(/\{name\}/, iconName);

    return url;
  };


  /**
   * Find an icon name associated with
   * a data type.
   *
   * @param {string} type Marker data type.
   * @return {string} Icon name.
   *
   * @protected
   */
  PointDataMarker.prototype.lookupTypeIcon_ = function(type) {
    return this.iconLookup_[type];
  };


  /**
   * Override to set how the marker's
   * title attribute is parsed from
   * the data.
   *
   * @protected
   * @return {string}
   */
  PointDataMarker.prototype.getTitleFromData_ = function() {
    return '';
  };


  return PointDataMarker;
});
