define([
  'aeris/util',
  'aeris/maps/markers/marker',
  'aeris/config'
], function(_, Marker, config) {
  /**
   * A marker MapExtensionObject which is a view
   * model for a {aeris.api.models.PointData} data model.
   *
   * @class PointDataMarker
   * @namespace aeris.maps.markers
   * @extends aeris.maps.markers.Marker
   *
   * @constructor
   * @override
  */
  var PointDataMarker = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      iconPath: config.get('assetPath') + '{name}.png',
      iconLookup: {},
      typeAttribute: ''
    });

    options.attributeTransforms = _.defaults(options.attributeTransforms || {}, {
      url: this.lookupUrl_,
      selectedUrl: this.lookupSelectedUrl_,
      title: this.lookupTitle_,
      position: this.lookupPosition_,
      type: this.lookupType_
    });


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
     * @property iconPath_
     */
    this.iconPath_ = options.iconPath;

    /**
     * The path to the icon url,
     * to use only when the marker is selected.
     *
     * Defaults to the iconPath.
     *
     * @property selectedIconPath_
     * @private
     * @type {string}
    */
    this.selectedIconPath_ = options.selectedIconPath || options.iconPath;


    /**
     * An object to lookup a marker's icon
     * url by it's type.
     *
     * eg: { blizzard: 'storm/icon_blizzard_sm', snow: 'stormicon_snow_sm' }
     *
     * @type {*|{}}
     * @private
     * @property iconLookup_
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
     * @property typeAttribute_
     */
    this.typeAttribute_ = options.typeAttribute;


    Marker.call(this, opt_attrs, options);
  };
  _.inherits(PointDataMarker, Marker);


  /**
   * The type category of this marker.
   * Generally, corresponds to a data filter.
   *
   * @override
   * @method getType
   * @return {string}
   */
  PointDataMarker.prototype.getType = function() {
    return this.get('type');
  };


  /**
   * Lookup the marker type.
   *
   * @return {string}
   * @protected
   * @method lookupType_
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
   * @return {string}
   * @protected
   * @method lookupUrl_
   */
  PointDataMarker.prototype.lookupUrl_ = function() {
    var iconName = this.getIconNameForType_();

    // If no icon name found,
    // don't try to set one.
    if (!iconName) { return this.get('url'); }

    return this.iconPath_.replace(/\{name\}/, iconName);
  };


  /**
   * @method lookupSelectedUrl_
   * @private
   */
  PointDataMarker.prototype.lookupSelectedUrl_ = function() {
    var iconName = this.getIconNameForType_();

    // If no icon name found,
    // don't try to set one.
    if (!iconName) { return this.get('selectedUrl'); }

    return this.selectedIconPath_.replace(/\{name\}/, iconName);
  };

  /**
   * @method getIconNameForType_
   * @private
   * @return {string}
   */
  PointDataMarker.prototype.getIconNameForType_ = function() {
    var type = this.getType() || this.lookupType_();

    return this.lookupTypeIcon_(type);
  };


  /**
   * Find an icon name associated with
   * a data type.
   *
   * @param {string} type Marker data type.
   * @return {string} Icon name.
   *
   * @protected
   * @method lookupTypeIcon_
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
   * @method lookupTitle_
   */
  PointDataMarker.prototype.lookupTitle_ = function() {
    return '';
  };


  /**
   * Lookup marker position
   * from data model.
   *
   * @protected
   * @return {aeris.maps.LatLon}
   * @method lookupPosition_
   */
  PointDataMarker.prototype.lookupPosition_ = function() {
    var loc = this.getDataAttribute('loc');

    // Fallback to current position
    if (!loc) { return this.get('position'); }

    return [
      loc.lat,
      loc.long
    ];
  };


  return PointDataMarker;
});
