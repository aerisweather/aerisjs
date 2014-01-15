define({
  $exports: { $ref: 'geosearchModule' },

  geosearchModule: {
    create: {
      module: 'ai/builder/maps/geosearch/module/geosearchmodule',
      args: [
        {
          eventHub: { $ref: 'eventHub' },
          geolocateController: { $ref: 'geolocateController' },
          geocodeController: { $ref: 'geocodeController' }
        }
      ]
    }
  },

  geolocateTemplate: { module: 'hbars!ai/builder/maps/geosearch/view/geolocate.html' },
  geosearchTemplate: { module: 'hbars!ai/builder/maps/geosearch/view/geocode.html' },

  geolocateController: {
    create: {
      module: 'ai/builder/maps/geosearch/controller/geolocatecontroller',
      args: [
        {
          tagName: 'span',
          mapState: { $ref: 'mapState' },
          eventHub: { $ref: 'eventHub' },
          geolocateService: { create: 'ai/geolocate/html5geolocateservice' },
          zoomTo: 8,

          template: { $ref: 'geolocateTemplate' },
          ui: {
            geolocateBtn: 'a'
          }
        }
      ]
    }
  },

  geocodeController: {
    create: {
      module: 'ai/builder/maps/geosearch/controller/geocodecontroller',
      args: [
        {
          mapState: { $ref: 'mapState' },
          eventHub: { $ref: 'eventHub' },
          geocodeService: { create: 'ai/geocode/googlegeocodeservice' },
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
        }
      ]
    }
  }
});
