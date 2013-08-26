# Aeris Interactive Library Build process

The Aeris Interactive Library uses the following build tools:

* r.js optimizer for RequireJS modules
* Compass stylesheet compiler


## Building the library

To build the library run the following command from the `/deployment` directory

```
./build.sh /deployment_dir
```

where `/deployment_dir` is the absolute path to the directory where the library will be deployed (eg. http://aerisapi.com/maps/).

The build script outputs to a log file at `/deployment/build.log`

### Dependencies

The build script requires:

* Node, with modules:
	* Underscore (`npm install underscore`)
	* RequireJS (`npm install requirejs`)
* Ruby (for Compass)
* Compass


## Build configuration

### r.js Optimizer

The `build.sh` script runs the r.js optimizer twice, using two different r.js configuration files

0. For the application library, using `/deployment/build.js`
0. For the aeris.Loader component, using `/deployment/buildLoader.js`

The loader component is built separately, in order to

* Wrap itself in an anonymous function, to protect the global scope (see `start.frag.js`)
* Include the RequireJS AMD loader library
* Include a facade for the aeris.Loader component (see `end.frag.js`)


### Vendor Libraries

Vendor libraries are defined in `/lib/vendor/libs.js`. AMD module wrappers for vendor libraries are dynamically generated using the definition file (see `/lib/vendor/config.js`). The configuration script first checks if the vendor library exists in the global namespace, and if not, sets the module path to a remote file (eg. on a CDN).

The build script also reads from the vendor definition file in order to tell the r.js optimizer not to attempt to build the vendor library paths. The `/deployment/vendorPathsBuildConfigGenerator.js` node script creates a temporary version of the the r.js build configuration file which defines `'empty:'` paths for all of  the dynamically generated vendor library modules.


### Compass projects

Compass projects are listed in `/deployment/themes.conf', and are relative to the `/lib` directory.
