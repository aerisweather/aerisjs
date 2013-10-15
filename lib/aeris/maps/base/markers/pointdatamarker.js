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
      iconTypeAttribute: ''
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
     * A hash of data attribute values to
     * icon url file names.
     *
     * eg: { blizzard: 'storm/icon_blizzard_sm', snow: 'stormicon_snow_sm' }
     *
     * @type {*|{}}
     * @private
     */
    this.iconLookup_ = options.iconLookup;


    /**
     * The data attribute which determines the icon url,
     * as mapped out in this.iconLookup_.
     *
     * Defined as a '.' delimited string.
     * eg. 'weather.type' would map to this.get('data').get('weather').type;
     *
     * @type {*|string}
     * @private
     */
    this.iconTypeAttribute_ = options.iconTypeAttribute;


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


  /**
   * Set the marker icon to match
   * the stormreport type.
   * @private
   */
  PointDataMarker.prototype.updateIcon_ = function() {
    var url, iconName;
    var typeParts = this.iconTypeAttribute_.split('.');
    var type = this.get('data');

    // Convert this.iconTypeAttribute_ into a attr reference
    _.each(typeParts, function(part, n) {
      if (n === 0) {
        type = this.get('data').get(part);
      }
      else {
        type = type[part];
      }
    }, this);

    // Find the first matching type icon
    // in an array of types
    if (_.isArray(type)) {
      _.each(type, function(tt) {
        if (this.iconLookup_[tt]) {
          iconName = this.iconLookup_[tt];
        }
      }, this);
    }
    else {
      iconName = this.iconLookup_[type];
    }

    if (!iconName) { return; }

    url = this.iconPath_.replace(/\{name\}/, iconName);

    this.setUrl(url);
  };



  return PointDataMarker;
});
