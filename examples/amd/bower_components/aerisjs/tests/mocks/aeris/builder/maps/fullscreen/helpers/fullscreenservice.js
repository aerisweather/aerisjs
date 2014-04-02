define([
  'aeris/util',
  'mocks/mockfactory',
  'aeris/events'
], function(_, MockFactory, Events) {
  var MockFullscreenService = new MockFactory({
    methods: [
      'requestFullscreen',
      'exitFullscreen',
      'isSupported'
    ]
  });
  _.extend(MockFullscreenService.prototype, Events.prototype);

  return MockFullscreenService;
});
