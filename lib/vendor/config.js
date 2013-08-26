/**
 * @fileoverview Dynamically create vendor library modules
 * from vendor/libs definition file. Resulting vendor/ module
 * will either pull in existing library in the global
 * namespace, or target a remote (CDN) path.
 *
 * @todo Set minimum versions, and only use global library
 * object if it is a high enough version.
 */
define(['vendor/libs'], function(libs) {
  /**
   * @typedef {Object} lib
   * @property {string} lib.module Name of the vendor module
   * @property {Object} lib.global The global object to check for, before
   *                    grabbing the lib from a cdn instead.
   * @property {Object} lib.shim Shim for require.config
   */
  /**
   * Inject 'vendor/' modules to grab libs from
   * either a CDN, or an existing global object.
   *
   * @param {Array.<lib>} libs
   */
  function generateVendorModules(libs) {
    for (var i = 0; i < libs.length; i++) {
      var reqs = [];
      var cdnPaths = {};
      var shim = {};
      var globalObj = window[libs[i].global];

      // Shim config
      shim[libs[i].module] = libs[i].shim || {};

      // No global exists...
      if (!globalObj) {
        // Create a path to the CDN
        cdnPaths[libs[i].module] = libs[i].cdn;

        // Require the CDN, if no global exists
        reqs.push(libs[i].module);
      }


      require.config({
        paths: cdnPaths,
        shim: shim
      });


      (function(j, globalObj) {
        // Generate 'vendor/' module
        define('vendor/' + libs[j].module, reqs, function(module) {
          // jQuery is super-duper special,
          // and doesn't like using the shim.init for noConflict
          // So we're going to give it special treatment here,
          // -- by way of a hack.
          if (module && module.fn && module.fn.jquery) {
            return module.noConflict();
          }

          // Return global object, if it exists
          // Otherwise the obj returned by the CDN path.
          return globalObj || module;
        });
      })(i, globalObj); // Use closure to maintain value of `i`
    }
  }

  generateVendorModules(libs);
});
