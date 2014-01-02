define([
  'aeris/util'
], function() {
  return {
    $exports: { $ref: 'geosearchModule' },

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

    geolocateTemplate: { module: 'hbars!mapbuilder/geosearch/view/geolocate.html' },
    geosearchTemplate: { module: 'hbars!mapbuilder/geosearch/view/geocode.html' },

    geolocateController: {
      create: {
        module: 'mapbuilder/geosearch/controller/geolocatecontroller',
        args: [{
          tagName: 'span',
          mapState: { $ref: 'mapState' },
          eventHub: { $ref: 'eventHub' },
          geolocateService: { create: 'geolocate/html5geolocateservice' },
          zoomTo: 8,

          template: { $ref: 'geolocateTemplate' },
          ui: {
            geolocateBtn: 'a'
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
          template: { $ref: 'geosearchTemplate' },
          ui: {
            searchInput: 'input[type=search]',
            searchForm: 'form'
          },
          events: {
            'change input': 'geocode'
          }
        }]
      }
    }
  };
});
