define([
  'aeris/util',
  'aeris/events',
  'base/extension/mapextensionobject',
  'errors/validationerror'
], function(_, Events, MapExtensionObject, ValidationError) {
  /**
   * Representation of an Info Box.
   *
   * @class aeris.maps.InfoBox
   * @constructor
   * @extends aeris.maps.extension.MapExtensionObject
   */
  var InfoBox = function(opt_attrs, opt_options) {
    var options = _.extend({
      strategy: 'infoboxstrategy'
    }, opt_options);

    var attrs = _.extend({
      /**
       * The lat/lon position to place the info box.
       *
       * @attribute latLon
       * @type {Array.<number,number>}
       */
      latLon: undefined,


      /**
       * The HTML content to display in the info box.
       *
       * @attribute content
       * @type {string}
       */
      content: ''
    }, opt_attrs);


    MapExtensionObject.call(this, attrs, options);
    Events.call(this);
  };
  _.inherits(InfoBox, MapExtensionObject);
  _.extend(InfoBox.prototype, Events.prototype);


  /**
   * @override
   */
  InfoBox.prototype.validate = function(attrs)  {
    if (!_.isArray(attrs.latLon)) {
      return new ValidationError(attrs.latLon + ' is not a valid latLon coordinate');
    }

    return MapExtensionObject.prototype.validate.apply(this, arguments);
  };


  /**
   * Set the lat/lon location of the InfoBox
   * on the map.
   *
   * @param {Array.<number>} latLon
   */
  InfoBox.prototype.setLocation = function(latLon) {
    this.set('latLon', latLon, { validate: true });
  };


  /**
   * Set the HTML content of the InfoBox
   * @param {string|Node} content
   */
  InfoBox.prototype.setContent = function(content) {
    this.set('content', content, { validate: true });
  };


  return _.expose(InfoBox, 'aeris.maps.InfoBox');

});
