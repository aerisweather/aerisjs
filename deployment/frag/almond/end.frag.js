  // In order for modules to be immediately available
  // under the aeris namespace, they must be required here.
  // Using commonJS format with almond --> synchronous require.
  //
  // To make this sustainable, we will need a build script
  // with writes these require statements from a package
  // config file.
  require('base/map');
  require('base/marker');
  require('base/infobox');
  return aeris;
}));