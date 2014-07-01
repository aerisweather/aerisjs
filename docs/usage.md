Basic Usage
===========

This document is only an introduction to the features of Aeris.js. Check out the reference API for more complete documentation.

- [Demos](#demos)
- [Supported Mapping Libraries](#supported-mapping-libraries)
- [Sandbox Environment](#sandbox-environment)
- [Overview of Features](#overview-of-features)
    - [Data and Weather API](#data-and-weather-api)
        - [Batch Requests](#batch-requests)
    - [Maps](#maps)
    - [Geoservices](#geoservices)
    - [AppBuilder](#appbuilder)
- [Integrating with Existing Applications](#integrating-with-existing-applications)

#### A Note For RequireJS Users
The examples in this document reference components within the global `aeris` namespace. This is appropriate when loading the library from a CDN. If you are loading components as RequireJS/AMD modules, you can find find modules by matching namespace paths to the aeris library file structure.

For example, [`aeris.maps.layers.Radar`](http://docs.aerisjs.com#aeris.maps.layers.Radar) can be found at [`aeris/maps/layers/radar`](https://github.com/hamweather/aerisjs/blob/master/src/maps/layers/aerisradar.js).


## Demos

In the interest of providing clear and concise demonstration code, not all of the examples in this document can run as-is. If you would like to see full working examples of Aeris.js code, visit our [Demos](demo.md) page.


## Supported Mapping Libraries

Aeris.js works with existing mapping libraries to render maps and map overlays. Currently three mapping libraries are supported:

* [Google Maps](https://developers.google.com/maps/)
* [Leaflet](http://leafletjs.com/)
* [OpenLayers](http://openlayers.org/)

The mapping library you choose is based on [which CDN package you are working with](install.md##from-a-cdn), or, if you're using AMD, by your [RequireJS configuration](install.md#specifying-a-map-library).

There is currently some variation in feature support between the mapping library. The following is a list of supported features for each library.


                                       | Google Maps | Leaflet | OpenLayers
-------                                | ----------- | ------- | ----------
**Maps**                               | ✓           | ✓       | ✓
**Markers**                            | ✓           | ✓       | ✓
**Marker Clusters**                    | ✓           | ✓       |
**Info Boxes**                         | ✓           |         | ✓
**Tile Layers**                        | ✓           | ✓       | ✓
**Google Map Base Layers**             | ✓           |         | ✓
**KML Layers**                         | ✓           |         |
**Polygons** (eg. convective layers)   | ✓           |         |
**Polylines**                          | ✓           |         |


## Sandbox Environment

The Aeris.js repo includes a [sandbox environment](https://github.com/hamweather/aerisjs/tree/dev/examples/sandbox) to make it easier for contributers to get started playing around with the library. To get started using the sandbox:

- Clone the Aeris.js repo.
- Copy [`/examples/apikeys.example.js`](/examples/apikeys.example.js) to `/examples/apikeys.js`, using [your Aeris API keys](http://www.hamweather.com/account/signup/).
- If you want to change the map library (Leaflet is default) change the config in [`init.js`](/examples/sandbox/js/init.js) as described [here](/docs/install.md#specifying-a-map-library).
- Write your own code in [`main.js`](/examples/sandbox/js/main.js)
- Open [`/examples/sandbox/index.html`](/examples/sandbox/index.html) to run your application.


There is also a [jsFiddle](http://jsfiddle.net/zCr2f/5/) sandbox.


# Overview of Features

## Data and Weather API

The Aeris.js `api` library provides a javascript interface for interacting with data from the [Aeris API](http://www.hamweather.com/support/documentation/aeris/endpoints/). Data collection objects accept a [`params`](http://docs.aerisjs.com/api/classes/aeris.api.params.models.Params.html) object, which is used to query the AerisAPI.

```javascript
var stormReportCollection = new aeris.api.collections.StormReports(null, {
    // See AerisAPI documentation for accepted params
    // http://www.hamweather.com/support/documentation/aeris/endpoints/
    params: {
        from: '-2weeks',
        p: 'minneapolis,mn',
        radius: '100mi',
        limit: 10,
        filters: ['ice', 'snow']
    }
});
```

You may also specify the action to use for requesting data (generally, defaults to `within`)

```javascript
var stormReports = new aeris.api.collections.StormReports(null, {
    action: 'closest',
    params: {
        p: '55415'
    }
});
```

Data collections are populated via ajax requests, using the `fetch` method, which returns an [`aeris.Promise`](http://docs.aerisjs.com#aeris.Promise) object.

```javascript
    stormReports.fetch().
        done(function(response) {
            // stormReports is populated with data
        }).
        fail(function(err) {
            // Failed to load data from the API.
        });

    // Or, listen to events on the collection
    stormReports.on({
        sync: function() {
            // data has been fetched from the API
        },
        add: function() {
            // new storm reports were added to the collection
        }
    });
```

Data collections extend from [`Backbone.Collection`](http://backbonejs.org/#Collection), and thus provide all the same methods as a `Backbone.Collection`.

```javascript
stormReportCollection.each(function(stormReport) {
    console.log(stormReport.get('report').detail.snowIN + ' of snow fell');
    // See AerisAPI documentation for data attributes
});
```


Individual models can be retrieved from the AerisAPI by id.

```javascript
    var earthquake = new aeris.api.models.Earthquake({
        id: 'nc72142075'
    });

    earthquake.fetch();
```

Data collections are defined for the following [AerisAPI endpoints](http://www.hamweather.com/support/documentation/aeris/endpoints/):


| Endpoint          | Model                                                                                     | Collection                                                                                          |
| ----------------- |-------------------------------------------------------------------------------------------| ----------------------------------------------------------------------------------------------------|
| `/advisories`     | [`aeris.api.models.Advisory`](http://docs.aerisjs.com#aeris.api.models.Advisory)          | [`aeris.api.collections.Advisorys`](http://docs.aerisjs.com#aeris.api.collections.Advisorys)        |
| `/earthquakes`    | [`aeris.api.models.Earthquake`](http://docs.aerisjs.com#aeris.api.models.Earthquake)      | [`aeris.api.collections.Earthquakes`](http://docs.aerisjs.com#aeris.api.collections.Earthquakes)    |
| `/fires`          | [`aeris.api.models.Fire`](http://docs.aerisjs.com#aeris.api.models.Fire)                  | [`aeris.api.collections.Fires`](http://docs.aerisjs.com#aeris.api.collections.Fires)                |
| `/forecasts`      | [`aeris.api.models.Forecast`](http://docs.aerisjs.com#aeris.api.models.Forecast)          | none                                                                                                |
| `/lightning`      | [`aeris.api.models.Lightning`](http://docs.aerisjs.com#aeris.api.models.Lightning)        | [`aeris.api.collections.Lightning`](http://docs.aerisjs.com#aeris.api.collections.Lightning)        |
| `/normals`        | [`aeris.api.models.Normal`](http://docs.aerisjs.com#aeris.api.models.Normal)              | [`aeris.api.collections.Normals`](http://docs.aerisjs.com#aeris.api.collections.Normals)            |
| `/observations`   | [`aeris.api.models.Observation`](http://docs.aerisjs.com#aeris.api.models.Observation)    | [`aeris.api.collections.Observations`](http://docs.aerisjs.com#aeris.api.collections.Observations)  |
| `/records`        | [`aeris.api.models.Record`](http://docs.aerisjs.com#aeris.api.models.Record)              | [`aeris.api.collections.Records`](http://docs.aerisjs.com#aeris.api.collections.Records)            |
| `/stormcells`     | [`aeris.api.models.StormCell`](http://docs.aerisjs.com#aeris.api.models.StormCell)        | [`aeris.api.collections.StormCells`](http://docs.aerisjs.com#aeris.api.collections.StormCells)      |
| `/stormreports`   | [`aeris.api.models.StormReport`](http://docs.aerisjs.com#aeris.api.models.StormReport)    | [`aeris.api.collections.StormReports`](http://docs.aerisjs.com#aeris.api.collections.StormReports)  |
| `/sunmoon`        | [`aeris.api.models.SunMoon`](http://docs.aerisjs.com#aeris.api.models.SunMoon)            | none                                                                                                |
| `/tides`          | [`aeris.api.models.Tide`](http://docs.aerisjs.com#aeris.api.models.Tide)                  | [`aeris.api.collections.Tides`](http://docs.aerisjs.com#aeris.api.collections.Tides)                |



#### Batch Requests

Using the `aeris.api.models.AerisBatchModel`, you can request data from multiple endpoints using a single API request.

```javascript
var batchModel = new aeris.api.models.AerisBatchModel({
  observation: new aeris.api.models.Observation()

  sevenDayForecast: new aeris.api.models.Forecast({
    // Each model can specify it's own parameters
    params: {
      filter: ['day'],
      limit: 7
    }
  }),

  hourlyForecast: new aeris.api.models.Forecast({
    params: {
      filter: ['1hr'],
      limit: 24
    }
  }),
}, {
  // These params will apply to all sub-requests
  params: {
    p: 'minneapolis,mn'
    }
  }
});

batchModel.fetch();
```

Running `batchModel.toJSON()` will return something like:

```javascript
{
  observation: {
    id: "KMSP",
    ob: {
      tempF: "62",
      windMPG: 10,
      ...
    }
  }
  sevenDayForecast: {
    interval: "day",
    periods: [...],
    ...
  },
  hourlyForecast: {
    interval: "1hr",
    periods: [...]
  }
}
```

There are several advantages to using batch requests:

* Combine different kinds of data into a single model, for the same location (or other shared attribute).
* Reduce the number of network requests to the server
* Reduce the asynchronous complexity of your code

For more on batch requests, see the [Aeris API Batch Requests documentation](http://www.hamweather.com/support/documentation/aeris/batch/).


## Maps

#### Basic Map Objects

[`Map`](http://docs.aerisjs.com#aeris.maps.Map) objects are rendered and erased using the `setMap` method.

```javascript
var map = new aeris.maps.Map('map-canvas');
var marker = new aeris.maps.markers.Marker({
    position: [45, -90]     // lat lon coordinate
});

marker.setMap(map);         // marker is rendered on the map
marker.setMap(null);        // marker is erased from the map
```

Map objects can be manipulted using **getter** and **setter** methods.

```javascript
var marker = new aeris.maps.markers.Marker({
    // Attributes can also be set in constructor
    position: [45, -90];
});
marker.setMap(map);

function moveMarkerNorthEastABit() {
    var currentPosition = marker.getPosition();
    var northEastABit = [currentPosition[0] + 0.1, currentPosition[1] + 0.1];

    marker.setPosition(northEastABit);
}

moveMarkerNorthEastABit();
marker.getPosition();       // [45.1, -89.9]
```

```javascript
var layer = new aeris.maps.layers.Radar({
    opacity: 1.0
});
layer.setMap(map);

function fadeOutLayer() {
    var int = window.setInterval(function() {
        var lessOpaque = layer.getOpacity() - 0.1 || 0;

        if (layer.getOpacity <= 0) {
            window.clearInterval(int);
            return;
        }

        layer.setOpacity(lessOpaque);
    }, 100);
}
```

Map objects fire events.

```javascript
var infoBox;
var marker = new aeris.maps.markers.Marker({
    position: [45, -90]
});
marker.setMap(map);

marker.on({
    'click': function() {
        if  (infoBox) { infoBox.setMap(null); }

        infoBox = new aeris.maps.InfoBox({
            position: marker.getPosition(),
            content: 'Marker is at lat/lon: ' + marker.getPosition().toString()
        });
        infoBox.setMap(map);
    }
    'change:position': function() {
        if (infoBox) {
            infoBox.setContent('Marker is at long/lon: ' + marker.getPosition().toString())
        }
    }
});
```



#### Rendering Map Objects From Weather API Data

[`MarkerCollections`](http://docs.aerisjs.com#aeris.maps.markercollections) can be used to render Aeris API data.

```javascript
var earthquakeMarkers = new aeris.maps.markercollections.EarthquakeMarkers();

earthquakeMarkers.setMap(map);

// Fetch earthquake data from Aeris API
// Markers will be set to the map for every data model fetched.
earthquakeMarkers.fetchData();


// Look for new earthquakes when the
// map changes location
map.on('change:bounds', function() {
    // Update the query parameters for the Aeris API request,
    // limited the search to the bounds of the map viewport
    earthquakeMarkers.setParams({
        p: map.getBounds()
    });
    earthquakeMarkers.fetchData();
});


// Render earthquake data on click
earthquakeMarkers.on('click', function(latLon, marker) {
    var infoBox = new aeris.maps.InfoBox({
        position: latLon,
        content: myTemplate(marker.getData().toJSON())
    });
    infoBox.setMap(map);
});
```


## Geoservices

Aeris.js provides wrappers around a number of 3rd party APIs and services. This allows you to easily switch out one service for another, using the same interface.

```javascript
var geolocator;

// Check for HTML geolocation support
if (aeris.geolocate.HTML5GeolocateService.isSupported()) {
    geolocator = new aeris.geolocate.HTML5GeolocateService();
}
else {
    // Fall back to IP-based geolocation
    geolocator = new aeris.geolocate.FreeGeoIPGeolocateService();
}

$('#findMe').click(function() {
    geolocator.getCurrentPosition().
        done(function(position) {
            alert('You are at lat/lon: ' + position.latLon.toString());
        });
});
```

See the reference documentation for more details about geoservices:

* [`Geolocation services`](http://docs.aerisjs.com#aeris.geolocate)
* [`Geocode services`](http://docs.aerisjs.com#aeris.geocode)



## Integrating with Existing Applications

It is possible to use Aeris.js with existing map-based applications, without having to refactor all of your current code to use `aeris` objects. Simply pass in your map object to `aeris.maps.Map`:

```javascript
var myGoogleMap = new google.maps.Map(mapCanvas);

// Do some really amazing stuff with your google map
// ...


// Creat an Aeris "wrapper" around your google map
var myAerisMap = new aeris.maps.Map(myGoogleMap);

// Add a rdar layer to your map
var radar = new aeris.maps.layers.Radar();
radar.setMap(myAerisMap);
```

This will work with any mapping library supported by Aeris.js. See [Supported Mapping Libraries](#supported-mapping-libraries) for a full list.


You can also access the core map from your Aeris map using the `getView` method. This is useful if you want to integrate map-library-specific code with your Aeris.js code.

```javascript
var myAerisMap = new aeris.maps.Map('map-canvas');

// Do some really amazing stuff with your Aeris.js map
// ...

// Grab your Leaflet map object
// (assuming we're using the aeris-leaflet.js package)
var leafletMap = myAerisMap.getView();

// Create an awesome marker
var prettyCoolIcon = L.AwesomeMarkers.icon({
icon: 'globe',
markerColor: 'blue'
});
new L.Marker([45, -90], {
icon: prettyCoolIcon
}).addTo(leafletMap);
```