define({
  $exports: {
    map: { wire: 'aeris/builder/maps/map/config/module' },

    mapControls: { wire: 'aeris/builder/routes/mapcontrols/config/module' },

    markers: { wire: 'aeris/builder/maps/markers/config/module' },
    layers: { wire: 'aeris/builder/maps/layers/config/module' },
    infoPanel: { wire: 'aeris/builder/maps/infopanel/config/module'},
    geosearch: { wire: 'aeris/builder/maps/geosearch/config/module' },
    modal: { wire: 'aeris/builder/maps/modal/config/module' },

    routeBuilder: { wire: 'aeris/builder/routes/routebuilder/config/module' }
  }
});
