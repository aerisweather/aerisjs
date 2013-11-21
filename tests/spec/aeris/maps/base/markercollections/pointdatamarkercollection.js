define([
  'aeris/util',
  'base/markercollections/pointdatamarkercollection',
  'aeris/collection',
  'api/endpoint/collection/pointdatacollection'
], function(_, PointDataMarkerCollection, Collection, PointDataCollection) {

  var MockDataCollection = function() {
    Collection.apply(this, arguments);

    this.setParams = jasmine.createSpy('data#setParams');
  };
  _.inherits(MockDataCollection, PointDataCollection);



  describe('A PointDataMarkerCollection', function() {

    describe('constructor', function() {

      beforeEach(function() {
        spyOn(PointDataMarkerCollection.prototype, 'startClustering');
      });

      it('should start clustering, if the cluster option is set to true', function() {
        new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection(),
          cluster: true
        });

        expect(PointDataMarkerCollection.prototype.startClustering).toHaveBeenCalled();
      });

      it('should start clustering, if the cluster option is set to false', function() {
        new PointDataMarkerCollection(undefined, {
          data: new MockDataCollection(),
          cluster: false
        });

        expect(PointDataMarkerCollection.prototype.startClustering).not.toHaveBeenCalled();
      });

    });


  });

});
