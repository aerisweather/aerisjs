define([
  'mocks/mockfactory',
  'aeris/collection'
], function(MockFactory, Collection) {
  var MockToggleCollection = new MockFactory({
    methods: [
      'selectAll',
      'deselectAll',
      'toggleAll',
      'selectOnly',
      'getSelected',
      'getDeselected'
    ],
    inherits: Collection
  });


  MockToggleCollection.prototype.getSelected = function() {
    return [];
  };

  MockToggleCollection.prototype.getDeselected = function() {
    return [];
  };


  return MockToggleCollection;
});
