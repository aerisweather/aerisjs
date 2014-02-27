define(['aeris/util', 'aeris/model'], function(_, Model) {
  var root = this;
  var Marker_orig = _.path('google.maps.Marker', root);

  var MockMarker = function(options) {
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
  _.inherits(MockMarker, Model);

  MockMarker.useMockMarker = function() {
    _.expose(MockMarker, 'google.maps.Marker');
  };

  MockMarker.restore = function() {
    _.expose(Marker_orig, 'google.maps.Marker');
  };


  MockMarker.prototype.getCtorOptions = function() {
    return this.ctorOptions_;
  };

  MockMarker.prototype.getIconUrl = function() {
    return this.get('icon').url;
  };

  MockMarker.prototype.getIconOffsetX = function() {
    return this.get('icon').anchor.x;
  }

  MockMarker.prototype.getIconOffsetY = function() {
    return this.get('icon').anchor.y;
  };


  /**
   * @method setIcon
   * @param {Object} icon
   */
  MockMarker.prototype.setIcon = function(icon) {
    this.set('icon', icon, { validate: true });
  };

  /**
   * @method getIcon
   * @return {Object}
   */
  MockMarker.prototype.getIcon = function() {
    return this.get('icon')
  };

  /**
   * @method setMap
   * @param {google.maps.Map} map
   */
  MockMarker.prototype.setMap = function(map) {
    this.set('map', map, { validate: true });
  };

  /**
   * @method getMap
   * @return {google.maps.Map}
   */
  MockMarker.prototype.getMap = function() {
    return this.get('map')
  };

  /**
   * @method setPosition
   * @param {google.maps.LatLng} position
   */
  MockMarker.prototype.setPosition = function(position) {
    this.set('position', position, { validate: true });
  };

  /**
   * @method getPosition
   * @return {google.maps.LatLng}
   */
  MockMarker.prototype.getPosition = function() {
    return this.get('position')
  };

  /**
   * @method setTitle
   * @param {string} title
   */
  MockMarker.prototype.setTitle = function(title) {
    this.set('title', title, { validate: true });
  };

  /**
   * @method getTitle
   * @return {string}
   */
  MockMarker.prototype.getTitle = function() {
    return this.get('title')
  };


  return MockMarker;
});
