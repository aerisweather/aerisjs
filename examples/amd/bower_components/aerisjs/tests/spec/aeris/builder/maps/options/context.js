/**
 * Test config for MapAppBuilderOptions
 */
define({
  MapAppBuilderOptions: {
    create: {
      module: 'aeris/classfactory',
      args: [
        { module: 'aeris/builder/maps/options/mapappbuilderoptions' },
        [
          null,             // opt_attrs
          {                 // opt_options
            defaults: {
              map: {
                zoom: 12,
                center: [44.98, -93.2636],
                scrollZoom: true
              },
              layers: [],
              markers: [],
              poi: [],
              controls: {
                layers: false,
                poi: false
              }
            },
            mapObjectTypes: ['layers', 'markers']
          }
        ],
        { extendArgObjects: true }
      ]
    }
  }
});
