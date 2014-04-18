define([
  'aeris/util',
  'aeris/maps/markercollections/pointdatamarkers',
  'aeris/collection',
  'aeris/model'
], function(_, PointDataMarkers, Collection, Model) {

  var MockDataCollection = function() {
    Collection.apply(this, arguments);

    spyOn(this, 'setParams').andCallThrough();
    spyOn(this, 'getParams').andCallThrough();
    spyOn(this, 'setFrom').andCallThrough();
    spyOn(this, 'setTo').andCallThrough();
    spyOn(this, 'setLimit').andCallThrough();
    spyOn(this, 'setBounds').andCallThrough();
    spyOn(this, 'addFilter').andCallThrough();
    spyOn(this, 'removeFilter').andCallThrough();
    spyOn(this, 'resetFilter').andCallThrough();
    spyOn(this, 'addQuery').andCallThrough();
    spyOn(this, 'removeQuery').andCallThrough();
    spyOn(this, 'resetQuery').andCallThrough();
    spyOn(this, 'getQuery').andCallThrough();
  };
  _.inherits(MockDataCollection, Collection);

  MockDataCollection.prototype.setParams = function() {};
  MockDataCollection.prototype.getParams = function() {
    return new Model();
  };
  MockDataCollection.prototype.setBounds = function() {};
  MockDataCollection.prototype.setFrom = function() {};
  MockDataCollection.prototype.setTo = function() {};
  MockDataCollection.prototype.setLimit = function() {};
  MockDataCollection.prototype.addFilter = function() {};
  MockDataCollection.prototype.removeFilter = function() {};
  MockDataCollection.prototype.resetFilter = function() {};
  MockDataCollection.prototype.addQuery = function() {};
  MockDataCollection.prototype.removeQuery = function() {};
  MockDataCollection.prototype.resetQuery = function() {};
  MockDataCollection.prototype.getQuery = function() {};



  describe('A PointDataMarkers Collection', function() {

    describe('data proxy methods', function() {
      var mockData, markers;

      beforeEach(function() {
        mockData = new MockDataCollection();
        markers = new PointDataMarkers(null, {
          data: mockData
        });
      });

      it('should directly proxy params methods using the data object', function() {
        var proxyMethods = [
          'getParams',
          'setParams',
          'setFrom',
          'setTo',
          'setLimit',
          'setBounds',
          'addFilter',
          'removeFilter',
          'resetFilter',
          'addQuery',
          'removeQuery',
          'resetQuery',
          'getQuery'
        ];

        proxyMethods.forEach(function(methodName) {
          var RETURN_VAL_STUB = 'RETURN_VAL_STUB';
          var ARG_STUB_A = 'ARG_STUB_A';
          var ARG_STUB_B = 'ARG_STUB_B';

          mockData[methodName].andReturn(RETURN_VAL_STUB);

          expect(markers[methodName](ARG_STUB_A, ARG_STUB_B)).toEqual(RETURN_VAL_STUB);
          expect(mockData[methodName]).toHaveBeenCalledWith(ARG_STUB_A, ARG_STUB_B);
        });
      });

    });

  });

});
