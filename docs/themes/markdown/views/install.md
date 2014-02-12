# Installing Aeris Interactive

- [From a CDN](#from-a-cdn)
    - [Available Packages](#available-packages)
    - [Setting API Keys](#setting-api-keys)
- [RequireJS / AMD](#requirejs--amd)
    - [Dependencies](#dependencies)
    - [Specifying a Map Library](#specifying-a-map-library)
    - [Setting API Keys](#setting-api-keys-1)
    - [Using Bower](#using-bower)
    - [Download the repo](#download-the-repo)

## From a CDN

For basic usage, Aeris Interactive can be used from a CDN:

```html
<script type="text/javascript" src="[[CDN PATH]]"></script>
```

#### Available Packages

There are several hosted versions of the Aeris Interactive library, each with a varying set of features.

* **Weather for Google Maps**
    Render weather tile layers and data using Google Maps.

* **Weather for OpenLayers**
    Render weather tile layers and data using OpenLayers (Coming Soon!).

* **Weather API only**
    A javascript interface for the [Aeris Weather API](http://www.hamweather.com/support/documentation/aeris/).

* **Weather for Google Maps + Geo Services**
    Includes additional APIs for geolocation, geocoding, and directions.

* **Map AppBuilder**
    The Aeris AppBuilder allows you to easily create an easily configuration and robust weather map application. 



#### Setting API Keys
TBD (how is this done when using a CDN? Has this been tested?)


## RequireJS / AMD

Aeris.js uses [RequireJS](http://requirejs.org/) to load modules and components. Using RequireJS (or a compatible [AMD loader](http://en.wikipedia.org/wiki/Asynchronous_module_definition)), you can pick and choose which Aeris Interactive components you would like to use.

```javascript
require(['ai/maps/map', 'ai/maps/layers/radar'], function(AerisMap, Radar) {
    var map = new AerisMap('map-canvas');
    var radar = new Radar();

    radar.setMap(map);
});
```

You can then use the [RequireJS Optimizer](http://requirejs.org/docs/optimization.html) to package your application. Only the Aeris Interactive components which you used will be bundles into your application. This will likely result in a smaller footprint than when using a one-size-fits-all [CDN package](#from-a-cdn).

#### Dependencies

For the core maps and API libraries, Aeris Interactive relies heavily on [Underscore](http://underscorejs.org/) and [Backbone](http://backbonejs.org/). If you use Aeris Interactive from a CDN, these dependencies are bundled into the build.

In order to use Aeris Interactive as AMD modules, you must tell the library where to find its dependencies:

```javascript
require.config({
    paths: {
        // Specify base path
        ai: 'myApp/vendor/aeris-interactive/lib/aeris',

        // Core dependencies.
        // Required for all Aeris Interactive components
        underscore: 'myApp/vendor/underscore',
        backbone: 'myApp/vendor/backbone',

        // Google Maps AMD module loader plugin
        // See https://github.com/hamweather/googlemaps-amd
        // Only required is using Google Maps
        googlemaps: 'myApp/vendor/googlemaps',

        // Only required for marker collections rendered with Google Maps.
        // Must use exact version 2.1.1
        // (v2.1.2 includes a breaking change. Go figure.)
        // http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html
        markerclusterer: 'mapApp/lib/vendor/markerclusterer'
    },
    shim: {
        // Shim configuration may be required.
        // See http://requirejs.org/docs/api.html#config-shim
    }
});
```

If you are using any of the `AppBuilder` components, additional dependencies must be specified:

```javascript
require.config({
    paths: {
        // MarionetteJS is used to power much of the AppBuilder view structure
        marionette: 'myapp/vendor/backbone.marionette',

        // It may be possible to sub out jquery for Zepto,
        // though this hasn't been tested.
        jquery: 'myapp/vendor/jquery',

        // Templating engine
        Handlebars: 'myapp/vendor/handlebars',

        // Handlebars AMD loader plugin
        hbars: 'myapp/vendor/hbars',

        // Text AMD loader plugin
        text: 'myapp/vendor/text',

        // Must be specified in order to use the r.js optimizer
        // with WireJS.
        // See https://github.com/pieter-vanderwerff/wire-rjs-builder
        'wire/builder/rjs': 'myapp/vendor/rjsbuilder'
    },
    // WireJS is a dependency injection / IoC frameworks
    // used configure and boot the map application.
    // See https://github.com/cujojs/wire
    packages: [
        {
            name: 'wire',
            location: 'myapp/vendor/wire',
            main: 'wire'
        },
        {
            // Promise/A+ implementation
            // Dependency for WireJS
            // See https://github.com/cujojs/when
            name: 'when',
            location: 'myapp/vendor/when',
            main: 'when'
        },
        {
            // Aspect Oriented Programming for Javascript
            // Dependency for WireJS
            name: 'meld',
            location: 'myapp/vendor/meld',
            main: 'meld'
        }
    ],
    shim: {
        // Don't forget your shim config!
    }
});
```

I hear you saying: "Oy, that's a lot of dependencies!" Well yes -- this project rides on the back of giants, and I have no interest in reinventing the wheel. But if you're worried about entering a dependency hell, why not [give Bower a try](#using-bower).

See [Example app using Bower](examples.md#bower) for a full working RequireJS configuration.


#### Specifying a Map Library

The Aeris Interactive library allows all of its components to be rendered either by using [Google Maps API v3.x](https://developers.google.com/maps/), or [OpenLayers](http://openlayers.org/). To instruct Aeris Interactive on which library to use, you must specify a map rendering *strategy*.

```javascript
require.config({
    paths: {
        // For Google Maps
        'ai/maps/strategy': 'myApp/vendor/aeris-interactive/lib/aeris/maps/gmaps'

        // For OpenLayers
        'ai/maps/strategy': 'myApp/vendor/aeris-interactive/lib/aeris/maps/openlayers'
    }
});
```

All of the components of the public API are strategy-agnostic, meaning that they will interface which whatever strategy is provided to them. By setting the `strategy` path to `gmaps` or `openlayers`, Aeris Interactive components know to request the correct strategy implementation.

Not all functionalities are currently implemented for all map rendering strategies. If there's something you're sorely missing, I encourage you to take a look at how [strategy architecture](architecture#strategies) is implemented, and then submit a [pull request.](contributing.md)

Note that CDN pacakges are hard-coded to use a single strategy.

The map libraries will be loaded for you as AMD modules -- there is no need to include them separately. See [Setting API Keys](#setting-api-keys) for instructions of map library configuration.



#### Setting API Keys

Depending on which Aeris Interactive components you choose to use, you may be required to supply API keys. This can be accomplished via RequireJS Configuration, and should be set before loading any Aeris Interactive modules.

```javascript
require.config({
    config: {
        // Required for using weather data or tiles from the
        // Aeris API.
        // See http://www.hamweather.com/products/aeris-api/
        'ai/config': {
            apiId: '[YOUR AERIS API CLIENT ID]',
            apiSecret: '[YOUR AERIS API CLIENT SECRET]'
        },

        // Required only when using the MapQuest geocoding service
        'ai/geocode/config':  {
            apiId: '[YOUR MAPQUEST API KEY]'
        }
    },

    // If using google maps,
    // it is recommended to specify an API key
    // See https://github.com/hamweather/googlemaps-amd
    // for full documentation
    googlemaps: {
        params: {
            // Geometry library is required for a number of Aeris components
            // (only when using the Google Maps strategy)
            libraries: 'geometry',
            key: '[YOUR GOOGLE API KEY]'
        }
    }
});
```


#### Using Bower

[Bower](http://bower.io/) is a package manager for javascript libraries. Aeris Interactive can be installed as a Bower package:

```
bower install aeris-interactive
```

The Bower package includes all components of the Aeris Interactive library. Aeris Interactive dependencies will all be installed for you by Bower.

The only different to your RequireJS configuration will be the location of your vendor libraries:

```javascript
require.config({
    paths: {
        ai: 'bower_components/aeris-interactive/lib/aeris',

        underscore: 'bower_components/underscore/underscore'
        // etc...
    }
});
```

#### Download the repo

Of course, you can always just go ahead and download the whole repo and stick it in your application directory. This means you'll have to download and manage all your dependencies yourself, but maybe you're just that kind of person.

* [`master` branch](https://github.com/hamweather/aeris-interactive/archive/master.zip)
* [Releases](https://github.com/hamweather/aeris-interactive/releases)
* Clone the repo: `git clone https://github.com/hamweather/aeris-interactive.git`


----------


> Written with [StackEdit](https://stackedit.io/).
