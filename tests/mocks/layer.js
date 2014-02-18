define([
  'aeris/util',
  'mocks/model'
], function(_, MockModel) {
  /**
   * A stubbed out {aeris.maps.layers.Layer}
   *
   * @param {Object=} opt_options Layer properties.
   * @class MockLayer
   * @constructor
   */
  var MockLayer = function(opt_options) {
    var options = _.extend({
      subdomains: ['sd'],
      minZoom: 0,
      maxZoom: 12,
      name: 'LayerName',
      url: '{d}.server.com/{z}/{x}/{y}/{t}.png',
      attrs: {},  // Other attributes to stub
      map: false
    }, opt_options);

    // Attributes to stub
    var cannedAttrs = _.extend(_.pick(options,
      'minZoom',
      'maxZoom',
      'name',
      'subdomains'
    ), options.attrs);

    var layer = jasmine.createSpyObj('layer', [
      'zoomFactor',
      'getRandomSubdomain',
      'getUrl',
      'on',
      'hasMap'
    ]);

    // Use MockModel to stub attributes
    MockModel.call(layer, cannedAttrs);

    // Mock Layer methods
    layer.zoomFactor.andCallFake(function(zoom) {
        return zoom;
      });

    layer.getRandomSubdomain.andReturn(options.subdomains[0]);

    layer.getUrl.andReturn(options.url);

    layer.hasMap.andReturn(!!options.map);

    return layer;
  };

  _.inherits(MockLayer, MockModel);

  return MockLayer;
});
