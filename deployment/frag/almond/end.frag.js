  // In order for modules to be immediately available
  // under the aeris namespace, packages must be required here.

  require('ai/packages/maps');
  require('ai/packages/gmaps');
  require('ai/packages/api');
  require('ai/packages/geoservice');
  return aeris;
}));