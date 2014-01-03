define({
  $exports: {
    map: { wire: 'mapbuilder/map/config/module' },

    mapControls: { wire: 'routeappbuilder/mapcontrols/config/module' },

    markers: { wire: 'mapbuilder/markers/config/module' },
    layers: { wire: 'mapbuilder/layers/config/module' },
    infoPanel: { wire: 'mapbuilder/infopanel/config/module'},
    geosearch: { wire: 'mapbuilder/geosearch/config/module' },
    modal: { wire: 'mapbuilder/modal/config/module' },

    routeBuilder: { wire: 'routeappbuilder/routebuilder/config/module' }
  }
})