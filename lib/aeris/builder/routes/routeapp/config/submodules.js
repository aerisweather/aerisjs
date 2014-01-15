define({
  $exports: {
    map: { wire: 'ai/builder/maps/map/config/module' },

    mapControls: { wire: 'ai/builder/routes/mapcontrols/config/module' },

    markers: { wire: 'ai/builder/maps/markers/config/module' },
    layers: { wire: 'ai/builder/maps/layers/config/module' },
    infoPanel: { wire: 'ai/builder/maps/infopanel/config/module'},
    geosearch: { wire: 'ai/builder/maps/geosearch/config/module' },
    modal: { wire: 'ai/builder/maps/modal/config/module' },

    routeBuilder: { wire: 'ai/builder/routes/routebuilder/config/module' }
  }
})