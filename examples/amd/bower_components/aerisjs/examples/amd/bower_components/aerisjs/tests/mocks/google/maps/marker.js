define(['aeris/util', 'aeris/model'], function(_, Model) {
  var root = this;
  var Marker_orig = _.path('google.maps.Marker', root);

  /**
   * @class MockGoogleMarker
   * @param {Object=} options
   * @constructor
   */
  var MockGoogleMarker = function(options) {
    var stubMethods = [
      'setMap',
      'setPosition',
      'setTitle',
      'setIcon'
    ];

    this.ctorOptions_ = options;

    stubMethods.forEach(function(method) {
        spyOn(this, method).andCallThrough();
      }, this);

    Model.call(this, options);
  };
  _.inherits(MockGoogleMarker, Model);

  MockGoogleMarker.useMockMarker = function() {
    _.expose(MockGoogleMarker, 'google.maps.Marker');
  };

  MockGoogleMarker.restore = function() {
    _.expose(Marker_orig, 'google.maps.Marker');
  };


  MockGoogleMarker.prototype.getCtorOptions = function() {
    return this.ctorOptions_;
  };

  MockGoogleMarker.prototype.getIconUrl = function() {
    return this.get('icon').url;
  };

  MockGoogleMarker.prototype.getIconOffsetX = function() {
    return this.get('icon').anchor.x;
  };

  MockGoogleMarker.prototype.getIconOffsetY = function() {
    return this.get('icon').anchor.y;
  };


  /**
   * @method setIcon
   * @param {Object} icon
   */
  MockGoogleMarker.prototype.setIcon = function(icon) {
    this.set('icon', icon, { validate: true });
  };

  /**
   * @method getIcon
   * @return {Object}
   */
  MockGoogleMarker.prototype.getIcon = function() {
    return this.get('icon');
  };

  /**
   * @method setMap
   * @param {google.maps.Map} map
   */
  MockGoogleMarker.prototype.setMap = function(map) {
    this.set('map', map, { validate: true });
  };

  /**
   * @method getMap
   * @return {google.maps.Map}
   */
  MockGoogleMarker.prototype.getMap = function() {
    return this.get('map');
  };

  /**
   * @method setPosition
   * @param {google.maps.LatLng} position
   */
  MockGoogleMarker.prototype.setPosition = function(position) {
    this.set('position', position, { validate: true });
  };

  /**
   * @method getPosition
   * @return {google.maps.LatLng}
   */
  MockGoogleMarker.prototype.getPosition = function() {
    return this.get('position');
  };

  /**
   * @method setTitle
   * @param {string} title
   */
  MockGoogleMarker.prototype.setTitle = function(title) {
    this.set('title', title, { validate: true });
  };

  /**
   * @method getTitle
   * @return {string}
   */
  MockGoogleMarker.prototype.getTitle = function() {
    return this.get('title');
  };

  /**
   * @method setDraggable
   * @param {Boolean} isDraggable
   */
  MockGoogleMarker.prototype.setDraggable = function(isDraggable) {
    this.set('draggable', isDraggable, { validate: true });
  };

  /**
   * @method getDraggable
   * @return {Boolean}
   */
  MockGoogleMarker.prototype.getDraggable = function() {
    return this.get('draggable');
  };


  /**
   * @method setClickable
   * @param {Boolean} isClickable
   */
  MockGoogleMarker.prototype.setClickable = function(isClickable) {
    this.set('clickable', isClickable, { validate: true });
  };

  /**
   * @method getClickable
   * @return {Boolean}
   */
  MockGoogleMarker.prototype.getClickable = function() {
    return this.get('clickable');
  };


  return MockGoogleMarker;
});
