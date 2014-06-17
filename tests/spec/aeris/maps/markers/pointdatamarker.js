define([
  'aeris/util',
  'aeris/events',
  'aeris/model',
  'sinon',
  'aeris/maps/markers/pointdatamarker',
  'aeris/api/models/pointdata'
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

    this.marker = new PointDataMarker(undefined, {
      data: options.data
    });

    this.data = options.data;
  }


  var MockPointData = function() {
    // Use the base model constructor
    Model.apply(this, arguments);
  };
  _.inherits(MockPointData, PointData);


  describe('PointDataMarker', function() {

    describe('setting the marker icon from the report type', function() {
      var iconLookup, marker;

      beforeEach(function() {
        iconLookup = {
          snow: {
            url: 'snow_marker.png',
            offsetX: 12,
            offsetY: 14
          },
          wind: {
            url: 'wind_marker.png',
            offsetX: 6,
            offsetY: 7
          }
        };
        marker = new PointDataMarker(null, {
          data: new MockPointData(),
          typeAttribute: 'nested.type.attribute',
          iconLookup: iconLookup,
          iconPath: 'icons/{name}'
        });

        marker.__setDataType = function(type) {
          marker.getData().set({
            nested: {
              type: {
                attribute: type
              }
            }
          });
        };
      });


      it('should set the icon url, using the iconLookup option', function() {
        marker.__setDataType('snow');
        expect(marker.get('url')).toEqual('icons/' + iconLookup.snow.url);

        marker.__setDataType('wind');
        expect(marker.get('url')).toEqual('icons/' + iconLookup.wind.url);
      });


      it('should set the icon offsets, using the iconLookup option', function() {
        marker.__setDataType('snow');
        expect(marker.get('offsetX')).toEqual(iconLookup.snow.offsetX);
        expect(marker.get('offsetY')).toEqual(iconLookup.snow.offsetY);

        marker.__setDataType('wind');
        expect(marker.get('offsetX')).toEqual(iconLookup.wind.offsetX);
        expect(marker.get('offsetY')).toEqual(iconLookup.wind.offsetY);
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

    describe('attributeTransforms', function() {

      it('should bind its position to the data\'s latLon', function() {
        var data = new MockPointData();
        var marker = new PointDataMarker(undefined, {
          data: data
        });
        var latLon = [45, -90];

        data.set('latLon', latLon);
        expect(marker.get('position')).toEqual(latLon);
      });

    });


    describe('getType', function() {

      it('should return the reference describe by the typeAttribute option', function() {
        var marker = new PointDataMarker(undefined, {
          data: new MockPointData({
            foo: {
              report: {
                type: 'snow'
              }
            }
          }),
          typeAttribute: 'foo.report.type'
        });

        expect(marker.getType()).toEqual('snow');
      });

      it('should return undefined if the typeAttribute reference cannot be resolved', function() {
        var marker = new PointDataMarker(undefined, {
          data: new MockPointData({
            foo: {
              report: {
                type: 'snow'
              }
            }
          }),
          typeAttribute: 'foo.bar.faz'
        });

        expect(marker.getType()).toEqual(undefined);
      });

      it('should use the iconLookup option to choose from multiple types', function() {
        var marker = new PointDataMarker(undefined, {
          data: new MockPointData({
            foo: {
              report: {
                type: ['heavy', 'snow', 'wet']
              }
            }
          }),
          typeAttribute: 'foo.report.type',
          iconLookup: {
            snow: 'some_icon'
          }
        });

        expect(marker.getType()).toEqual('snow');
      });
    });

  });

});
