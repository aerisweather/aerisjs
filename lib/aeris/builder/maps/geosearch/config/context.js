define([
  'aeris/util'
], function() {
  return {
    geosearchModule: {
      create: {
        module: 'mapbuilder/geosearch/module/geosearchmodule',
        args: [{
          eventHub: { $ref: 'eventHub' },
          geolocateController: { $ref: 'geolocateController' },
          geocodeController: { $ref: 'geocodeController' }
        }]
      }
    },

    geolocateController: {
      create: {
        module: 'mapbuilder/geosearch/controller/geolocatecontroller',
        args: [{
          mapState: { $ref: 'mapState' },
          eventHub: { $ref: 'eventHub' },
          geolocateService: { create: 'geolocate/html5geolocateservice' },
          zoomTo: 8,

          className: 'aeris-geolocate',
          template: { module: 'vendor/text!mapbuilder/geosearch/view/geolocate.html' },
          ui: {
            geolocateBtn: 'button'
          }
        }]
      }
    },

    geocodeController: {
      create: {
        module: 'mapbuilder/geosearch/controller/geocodecontroller',
        args: [{
          mapState: { $ref: 'mapState' },
          eventHub: { $ref: 'eventHub' },
          geocodeService: { create: 'geocode/googlegeocodeservice' },
          zoomTo: 8,

          className: 'aeris-geocode',
          template: { module: 'vendor/text!mapbuilder/geosearch/view/geocode.html' },
          ui: {
            searchInput: 'input[type=text]',
            searchForm: 'form'
          }
        }]
      }
    }
  };
});
