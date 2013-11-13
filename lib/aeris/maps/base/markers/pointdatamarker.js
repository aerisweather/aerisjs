define([
  'aeris/util',
  'aeris/config',
  'base/marker',
  'aeris/errors/validationerror',
  'api/endpoint/model/pointdata'
], function(_, config, BaseMarker, ValidationError, PointData) {
  /**
   * A marker MapExtensionObject which is associated
   * with a {aeris.api.model.PointData} model.
   *
   * @class aeris.map.markers.PointDataMarker
   * @extends aeris.maps.Marker
   * @constructor
   */
  var PointDataMarker = function(opt_attrs, opt_options) {
    /**
     * Data associated with this marker
     *
     * @attribute data
     * @type {aeris.api.model.PointData}
     */
    var options = _.extend({
      iconPath: config.get('path') + 'assets/{name}.png',
      iconLookup: {},
      typeAttribute: ''
    }, opt_options);


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


    BaseMarker.call(this, opt_attrs, opt_options);


    // Update marker icons to match
    // StormReport type
    this.updateIcon_();
    this.listenTo(this.get('data'), {
      'change': this.updateIcon_
    });


    // Sync to changes in model
    this.get('data').on({
      'change:latLon': function(model, latLon) {
        this.setPosition(latLon);
      }
    }, this);
  };
  _.inherits(PointDataMarker, BaseMarker);


  /**
   * @override
   */
  PointDataMarker.prototype.validate = function(attrs) {
    if (!attrs.data || !(attrs.data instanceof PointData)) {
      return new ValidationError('data', 'Must be defined as a aeris.api.model.PointData object.');
    }
  };


  /**
   * Return data associated with this marker,
   * as a json object.
   *
   * @return {Object}
   */
  PointDataMarker.prototype.toJSON = function() {
    return this.get('data').toJSON();
  };


  PointDataMarker.prototype.getType = function() {
    var type = _.path(this.typeAttribute_, this.toJSON());
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

      return match;
    }

    return type;
  };


  /**
   * Set the marker icon to match
   * the stormreport type.
   * @private
   */
  PointDataMarker.prototype.updateIcon_ = function() {
    var url;
    var type = this.getType();
    var iconName = this.lookupTypeIcon_(type);

    // If no icon name found,
    // don't try to set one.
    if (!iconName) { return; }

    url = this.iconPath_.replace(/\{name\}/, iconName);

    this.setUrl(url);
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



  return PointDataMarker;
});
