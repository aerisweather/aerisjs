define([
  'aeris/util',
  'mocks/mockfactory',
  'aeris/model'
], function(_, MockFactory, Model) {
  var MockPolyline = MockFactory({
    methods: [
      'setStyles'
    ],
    inherits: Model,
    name: 'MockPolyline'
  });


  return MockPolyline;
});
