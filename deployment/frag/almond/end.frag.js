  // In order for modules to be immediately available
  // under the aeris namespace, they must be required here.
  // Using commonJS format with almond --> synchronous require.
  //
  // To make this sustainable, we will need a build script
  // with writes these require statements from a package
  // config file.
  require('ai/maps/map');
  require('ai/maps/marker');
  require('ai/maps/infobox');
  return aeris;
}));