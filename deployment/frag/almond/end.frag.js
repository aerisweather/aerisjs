  // In order for modules to be immediately available
  // under the aeris namespace, packages must be required here.

  require('aeris/packages/maps');
  require('aeris/packages/gmaps');
  require('aeris/packages/api');
  require('aeris/packages/geoservice');
  return aeris;
}));