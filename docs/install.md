# Installing Aeris.js

- [From a CDN](#from-a-cdn)
    - [Available Packages](#available-packages)
    - [Setting API Keys](#setting-api-keys)
    - [Using https](#using-https)
- [RequireJS / AMD](#requirejs--amd)
    - [Dependencies](#dependencies)
    - [Specifying a Map Library](#specifying-a-map-library)
    - [Setting API Keys](#setting-api-keys-1)
    - [Using Bower](#using-bower)
    - [Download the repo](#download-the-repo)

## From a CDN

For basic usage, Aeris.js can be used from a CDN:

```html
<script type="text/javascript" src="//cdn.aerisjs.com/aeris.min.js"></script>
```

#### Available Packages

There are several hosted versions of the Aeris.js library, each with a varying set of features.

* **Aeris.js**

    The default library includes all of the Aeris.js features, excluding the Map AppBuilder. Google Maps is used as the default mapping library.

    [//cdn.aerisjs.com/aeris.min.js](//cdn.aerisjs.com/aeris.min.js)

* **Weather for Google Maps**

    Render weather tile layers and data using [Google Maps](https://developers.google.com/maps/).

    [//cdn.aerisjs.com/gmaps.min.js](//cdn.aerisjs.com/gmaps.min.js)

* **Weather for OpenLayers**

    Render weather tile layers and data using [OpenLayers](http://openlayers.org/).

    *Note that not all mapping features are currently implemented for OpenLayers.*

    **Coming soon!**

* **Weather API only**

    A javascript interface for the [Aeris Weather API](http://www.hamweather.com/support/documentation/aeris).

    [//cdn.aerisjs.com/api.min.js](//cdn.aerisjs.com/api.min.js)

* **Weather for Google Maps + Geo Services**

    Includes additional APIs for [`geolocation`](http://docs.aerisjs.com#aeris.geolocate), [`geocoding`](http://docs.aerisjs.com#aeris.geocode), and [`directions`](http://docs.aerisjs.com/api/classes/aeris.directions.DirectionsServiceInterface.html).

    [//cdn.aerisjs.com/gmaps-plus.min.js](//cdn.aerisjs.com/gmaps-plus.min.js)
    


#### Setting API Keys

In order to use weather data from the Aeris API, you must provide an Aeris API client id and secret (visit [hamweather.com](http://www.hamweather.com/products/aeris-api/pricing/) to sign up for a free devleoper account). API keys may be set globally using the [`aeris.config`](http://docs.aerisjs.com#aeris.config) object:

```javascript
aeris.config.setApiKey('abcd1234');
aeris.config.setApiSecret('wxyz6789');
```


## RequireJS / AMD

Aeris.js uses [RequireJS](http://requirejs.org/) to load modules and components. Using RequireJS (or a compatible [AMD loader](http://en.wikipedia.org/wiki/Asynchronous_module_definition)), you can pick and choose which Aeris.js components you would like to use.

```javascript
require(['aeris/maps/map', 'aeris/maps/layers/radar'], function(AerisMap, Radar) {
    var map = new AerisMap('map-canvas');
    var radar = new Radar();

    radar.setMap(map);
});
```

You can then use the [RequireJS Optimizer](http://requirejs.org/docs/optimization.html) to package your application. Only the Aeris.js components which you used will be bundled into your application. This will likely result in a smaller footprint than when using a one-size-fits-all [CDN package](#from-a-cdn).

#### Dependencies

For the core maps and API libraries, Aeris.js relies heavily on [Underscore](http://underscorejs.org/) and [Backbone](http://backbonejs.org/). Note that if you use Aeris.js from a CDN, these dependencies are bundled into the build.

In order to use Aeris.js AMD modules, you must tell the library where to find its dependencies:

```javascript
require.config({
    paths: {
        // Specify base path of aeris-js library 
        aeris: 'myApp/vendor/aerisjs/src',

        // Core dependencies.
        // Required for all Aeris.js components
        underscore: 'myApp/vendor/underscore',
        backbone: 'myApp/vendor/backbone',

        // Google Maps AMD module loader plugin
        // See https://github.com/hamweather/googlemaps-amd
        // Only required if using Google Maps
        googlemaps: 'myApp/vendor/googlemaps',
        
        // The async AMD loader plugin is used by googlemaps.
        // See https://github.com/millermedeiros/requirejs-plugins
        async: 'myApp/vendor/async'

        // Only required for marker collections rendered with Google Maps.
        // Must use exact version 2.1.1
        // (v2.1.2 includes a breaking change. Go figure.)
        // http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html
        'gmaps-markerclusterer-plus': 'mapApp/lib/vendor/gmaps-markerclusterer-plus'

        // Only required for marker collections rendered with Leaflet
        // See https://github.com/Leaflet/Leaflet.markercluster
        'leaflet-markercluster': 'mapApp/lib/vendor/leaflet.markercluster'
    },

    // A Shim configuration is required for libraries which
    // do not support AMD out of the box.
    // See http://requirejs.org/docs/api.html#config-shim
    shim: {
        // Only required when using google maps
        'gmaps-markerclusterer-plus': {
          exports: 'MarkerClusterer'
        },

        // Only required when using Leaflet
        'leaflet-markercluster': {
          deps: ['leaflet'],
          exports: 'L.MarkerClusterGroup'
        }
    }
});
```

See [the AMD/Bower.js example app](https://github.com/hamweather/aerisjs/tree/master/examples/amd/src/app.js) for a full working RequireJS configuration.


#### Specifying a Map Library

By default,tThe Aeris.js library uses [Leaflet](http://leafletjs.com/) as it core mapping library. You can change which mapping library is used by overriding the `aeris/maps/strategy` AMD path.

```javascript
require.config({
    paths: {
        // Use Leaflet (default)
        'aeris/maps/strategy': 'myApp/vendor/aerisjs/src/maps/leaflet'

        // Use Google Maps
        'aeris/maps/strategy': 'myApp/vendor/aerisjs/src/maps/gmaps'

        // Use OpenLayers
        'aeris/maps/strategy': 'myApp/vendor/aerisjs/src/maps/openlayers'
    }
});
```

The map libraries will be loaded for you as AMD modules -- there is no need to include them separately. See [Setting API Keys](#setting-api-keys) for instructions of map library configuration.

Not all functionalities are currently implemented for all map rendering strategies. See [*Supported Mapping Libraries*](usage.md#supported-mapping-libraries) for a breakdown of supported features.



#### Setting API Keys

Depending on which Aeris.js components you choose to use, you may be required to supply API keys. This can be accomplished via RequireJS Configuration, and should be set before loading any Aeris.js modules.

```javascript
require.config({
    config: {
        // Required for using weather data or tiles from the
        // Aeris API.
        // See http://www.hamweather.com/products/aeris-api/
        'aeris/config': {
            apiId: '[YOUR AERIS API CLIENT ID]',
            apiSecret: '[YOUR AERIS API CLIENT SECRET]'
        },

        // Required only when using the MapQuest geocoding service
        'aeris/geocode/config':  {
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

[Bower](http://bower.io/) is a package manager for javascript libraries. Aeris.js can be installed as a Bower package:

```
bower install aerisjs
```

The Bower package includes all components of the Aeris.js library. Aeris.js dependencies will all be installed for you by Bower.

The only difference from your RequireJS configuration will be the location of your vendor libraries:

```javascript
require.config({
    paths: {
        aeris: 'bower_components/aerisjs/src',

        underscore: 'bower_components/underscore/underscore'
        // etc...
    }
});
```

#### Download the repo

Of course, you can always just go ahead and download the whole repo and stick it in your application directory. This means you'll have to download and manage all your dependencies yourself, but hey, to each their own.

* [`master` branch](https://github.com/hamweather/aerisjs/archive/master.zip)
* [Version releases](https://github.com/hamweather/aerisjs/releases)
* Clone the repo: `git clone https://github.com/hamweather/aerisjs.git`
