define([
  'aeris/util',
  'aeris/events',
  'aeris/maps/extensions/mapextensionobject',
  'aeris/errors/validationerror'
], function(_, Events, MapExtensionObject, ValidationError) {
  /**
   * Representation of an Info Box.
   *
   * @publicApi
   * @class InfoBox
   * @namespace aeris.maps
   * @constructor
   * @extends aeris.maps.extensions.MapExtensionObject
   */
  var InfoBox = function(opt_attrs, opt_options) {
    var options = _.extend({
      strategy: 'infobox'
    }, opt_options);

    var attrs = _.extend({
      /**
       * The lat/lon position to place the info box.
       *
       * @attribute position
       * @type {aeris.maps.LatLon}
       */
      position: [45, -90],


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
   * @method validate
   */
  InfoBox.prototype.validate = function(attrs)  {
    if (!_.isArray(attrs.position)) {
      return new ValidationError(attrs.position + ' is not a valid lat/lon coordinate');
    }

    return MapExtensionObject.prototype.validate.apply(this, arguments);
  };


  /**
   * Set the lat/lon location of the InfoBox
   * on the map.
   *
   * @param {aeris.maps.LatLon} position
   * @method setPosition
   */
  InfoBox.prototype.setPosition = function(position) {
    this.set('position', position, { validate: true });
  };


  /**
   * Set the HTML content of the InfoBox
   * @param {string|HTMLElement} content
   * @method setContent
   */
  InfoBox.prototype.setContent = function(content) {
    this.set('content', content, { validate: true });
  };


  return _.expose(InfoBox, 'aeris.maps.InfoBox');

});
