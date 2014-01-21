define([
  'ai/util',
  'ai/events',
  'ai/maps/extension/mapextensionobject',
  'ai/errors/validationerror'
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
       * @attribute position
       * @type {Array.<number,number>}
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
   * @override
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
   * @param {Array.<number>} position
   */
  InfoBox.prototype.setPosition = function(position) {
    this.set('position', position, { validate: true });
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
