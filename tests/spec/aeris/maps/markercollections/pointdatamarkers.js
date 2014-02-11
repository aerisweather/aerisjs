define([
  'ai/util',
  'ai/maps/markercollections/pointdatamarkers',
  'ai/collection',
  'ai/api/collections/pointdatacollection'
], function(_, PointDataMarkers, Collection, PointDataCollection) {

  var MockDataCollection = function() {
    Collection.apply(this, arguments);

    this.setParams = jasmine.createSpy('data#setParams');
  };
  _.inherits(MockDataCollection, PointDataCollection);



  describe('A PointDataMarkers', function() {

    describe('constructor', function() {

      beforeEach(function() {
        spyOn(PointDataMarkers.prototype, 'startClustering');
      });

      it('should start clustering, if the cluster option is set to true', function() {
        new PointDataMarkers(undefined, {
          data: new MockDataCollection(),
          cluster: true
        });

        expect(PointDataMarkers.prototype.startClustering).toHaveBeenCalled();
      });

      it('should start clustering, if the cluster option is set to false', function() {
        new PointDataMarkers(undefined, {
          data: new MockDataCollection(),
          cluster: false
        });

        expect(PointDataMarkers.prototype.startClustering).not.toHaveBeenCalled();
      });

    });


  });

});
