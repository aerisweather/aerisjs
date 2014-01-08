# Aeris Interactive Library Build process

The Aeris Interactive Library uses the following build tools:

* r.js optimizer for RequireJS modules
* Compass stylesheet compiler


## Building the library

To build the library run the following command from the `/deployment` directory

```
./build.sh buildConfig.js
```

where `buildConfig` is the path to the [r.js build config](https://github.com/jrburke/r.js/blob/master/build/example.build.js).

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

The r.js optimizer build config can be specified in a seperate file, and passed in a an argument to the `build.sh` script.


### Compass projects

Compass projects are listed in `/deployment/themes.conf`, and are relative to the `/lib` directory.
