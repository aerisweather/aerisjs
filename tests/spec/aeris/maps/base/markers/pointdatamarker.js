define([
  'aeris/util',
  'aeris/events',
  'sinon',
  'base/markers/pointdatamarker',
  'api/endpoint/model/pointdata'
], function(_, Events, sinon, PointDataMarker, PointData) {

  function TestFactory(opt_options) {
    var options = _.extend({
      attrs: {
        foo: 'bar'
      }
    }, opt_options);
    options = _.extend({
      data: new MockModel({
        attrs: options.attrs
      })
    }, options);

    this.options = options;

    this.marker = new PointDataMarker({
      data: options.data
    });

    this.data = options.data;
  }

  function MockModel(opt_options) {
    var options = _.extend({
      attrs: {
        foo: 'bar',
        hello: 'yo'
      }
    }, opt_options);

    spyOn(this, 'toJSON').andReturn(options.attrs);

    Events.call(this);
    _.extend(this, Events.prototype);
  }
  _.inherits(MockModel, PointData);
  MockModel.prototype = sinon.createStubInstance(PointData);


  describe('A PointDataMarker', function() {

    describe('validation', function() {

      it('should require a PointData model', function() {
        expect(function() {
          new TestFactory({
            data: new Date()
          }).toThrowType('ValidationError');
        });

        // Should not throw an error
        new TestFactory({
          data: new MockModel()
        });
      });

    });

    describe('events', function() {

      it('should bind its position to the data\'s latLon', function() {
        var test = new TestFactory();
        var latLon = [45, -90];

        spyOn(test.marker, 'setPosition');

        test.data.trigger('change:latLon', test.data, latLon);
        expect(test.marker.setPosition).toHaveBeenCalledWith(latLon);
      });

    });

    describe('getData', function() {

      it('should return JSON data', function() {
        var test = new TestFactory();

        expect(test.marker.getData()).toEqual(test.options.attrs);
      });

    });

  });

});
