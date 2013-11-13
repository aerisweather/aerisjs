define([
  'aeris/util',
  'aeris/events',
  'aeris/model',
  'sinon',
  'base/markers/pointdatamarker',
  'api/endpoint/model/pointdata'
], function(_, Events, Model, sinon, PointDataMarker, PointData) {

  function TestFactory(opt_options) {
    var options = _.extend({
      attrs: {
        foo: 'bar'
      }
    }, opt_options);
    options = _.extend({
      data: new MockPointData({
        attrs: options.attrs
      })
    }, options);

    this.options = options;

    this.marker = new PointDataMarker({
      data: options.data
    });

    this.data = options.data;
  }


  var MockPointData = function() {
    // Use the base model constructor
    Model.apply(this, arguments);
  };
  _.inherits(MockPointData, PointData);


  describe('A PointDataMarker', function() {

    describe('constructor', function() {

      it('should set the icon url, using the iconLookup option', function() {
        var marker;

        spyOn(PointDataMarker.prototype, 'getType').andReturn('snow');

        marker = new PointDataMarker({
          data: new MockPointData({
            report: {
              type: 'snow'
            }
          })
        }, {
          // Not necessary, as getType has been stubbed.
          // Showing here only for demonstration
          typeAttribute: 'data.report.type',
          iconLookup: {
            snow: 'snow_icon'
          },
          iconPath: 'icons/{name}.png'
        });

        expect(marker.get('url')).toEqual('icons/snow_icon.png');
      });

    });


    describe('validation', function() {

      it('should require a PointData model', function() {
        expect(function() {
          new TestFactory({
            data: new Date()
          }).toThrowType('ValidationError');
        });

        // Should not throw an error
        new TestFactory({
          data: new MockPointData()
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


    describe('getType', function() {

      it('should return the reference describe by the typeAttribute option', function() {
        var marker = new PointDataMarker({
          data: new MockPointData({
            foo: {
              report: {
                type: 'snow'
              }
            }
          })
        }, {
          typeAttribute: 'foo.report.type'
        });

        expect(marker.getType()).toEqual('snow');
      });

      it('should return undefined if the typeAttribute reference cannot be resolved', function() {
        var marker = new PointDataMarker({
          data: new MockPointData({
            foo: {
              report: {
                type: 'snow'
              }
            }
          })
        }, {
          typeAttribute: 'foo.bar.faz'
        });

        expect(marker.getType()).toEqual(undefined);
      });

      it('should use the iconLookup option to choose from multiple types', function() {
        var marker = new PointDataMarker({
          data: new MockPointData({
            foo: {
              report: {
                type: ['heavy', 'snow', 'wet']
              }
            }
          })
        }, {
          typeAttribute: 'foo.report.type',
          iconLookup: {
            snow: 'some_icon'
          }
        });

        expect(marker.getType()).toEqual('snow');
      });
    });

    describe('toJSON', function() {

      it('should return JSON data', function() {
        var marker = new PointDataMarker({
          data: new MockPointData({
            foo: {
              bar: 'baz'
            }
          })
        });

        expect(marker.toJSON()).toEqual({
          foo: {
            bar: 'baz'
          }
        });
      });

    });

  });

});
