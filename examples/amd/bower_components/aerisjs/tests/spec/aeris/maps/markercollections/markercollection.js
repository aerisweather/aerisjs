define([
  'aeris/util',
  'aeris/maps/markercollections/markercollection'
], function(_, MarkerCollection) {

  describe('A MarkerCollection', function() {

    describe('constructor', function() {

      beforeEach(function() {
        spyOn(MarkerCollection.prototype, 'startClustering');
      });

      it('should start clustering, if the cluster option is set to true', function() {
        new MarkerCollection(undefined, {
          cluster: true
        });

        expect(MarkerCollection.prototype.startClustering).toHaveBeenCalled();
      });

      it('should start clustering, if the cluster option is set to false', function() {
        new MarkerCollection(undefined, {
          cluster: false
        });

        expect(MarkerCollection.prototype.startClustering).not.toHaveBeenCalled();
      });

    });


    describe('getClusterOptions', function() {
      var STUB_CLUSTER_OPTIONS, markerCollection;

      beforeEach(function() {
        STUB_CLUSTER_OPTIONS = {
          foo: 'bar',
          faz: 'baz'
        };
        markerCollection = new MarkerCollection(null, {
          clusterOptions: STUB_CLUSTER_OPTIONS
        });
      });


      it('should return the clusterOptions provided in the constructor', function() {
        expect(markerCollection.getClusterOptions()).toEqual(STUB_CLUSTER_OPTIONS);
      });

    });

  });

});
