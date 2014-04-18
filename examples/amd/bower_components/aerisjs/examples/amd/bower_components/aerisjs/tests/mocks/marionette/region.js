define([
  'aeris/util',
  'mocks/mockfactory',
  'aeris/events'
], function(_, MockFactory, Events) {
  var MockRegion = new MockFactory({
    methods: [
      'show',
      'close'
    ],
    constructor: function() {
      Events.call(this);
    }
  });
  _.extend(MockRegion.prototype, Events.prototype);

  return MockRegion;
});