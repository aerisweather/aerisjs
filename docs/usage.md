Basic Usage
===========

This document is only an introduction to the features of Aeris Interactive. Check out the reference API for more complete documentation.


- [Overview of Features](#overview-of-features)
    - [Data and Weather API](#data-and-weather-api)
    - [Maps](#maps)
    - [Geoservices](#geoservices)
    - [AppBuilder](#appbuilder)

#### A Note For RequireJS Users
The examples in this document reference components within the global `aeris` namespace. This is appropriate when loading the library from a CDN. If you are loading components as RequireJS/AMD modules, you can find *most* items in a module path matchig up to the global namespace.

For example, `aeris.maps.layers.AerisRadar` can be found at `ai/maps/layers/aerisradar`.

## Data and Weather API

The Aeris Interactive api library provides a javascript interface for interacting with data from the [Aeris API](http://www.hamweather.com/support/documentation/aeris/endpoints/). Data collection objects accept a `params` object, which is used to query the AerisAPI.

```javascript
var stormReportCollection = new aeris.api.collection.StormReports(null, {
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
var stormReportCollection = new aeris.api.collection.StormReports(null, {
    action: 'closest',
    params: {
        p: '55415'
    }
});
```

Data collections are populated via ajax request, using the `fetch` method, which returns an `aeris.Promise` object.

```javascript
    stormReportCollection.fetch().
        done(function() {
            // stormReportCollection is populated with data
        }).
        fail(function(err) {
            // Failed to load data from the API.
        });

    // Or, listen to events on the collection
    stormReportCollection.on({
        sync: function() {
            // data has been fetched from the API
        },
        add: function() {
            // new storm reports were added to the collection
        }
    });
```

Data collections extend from [`Backbone.Collection`](http://backbonejs.org/#Collection):

```javascript
stormReportCollection.each(function(stormReport) {
    console.log(stormReport.get('report').detail.snowIN + ' of snow fell');
    // See AerisAPI documentation for data attributes
});
```


Individual models can be retrieved from the AerisAPI by id.

```javascript
    var earthquake = new aeris.api.Earthquake({
        id: 'nc72142075'
    });

    earthquake.fetch();
```

Data collections are defined for the following [AerisAPI endpoints](http://www.hamweather.com/support/documentation/aeris/endpoints/):


| Endpoint | Model | Collection |
| ----------------- |-------| -----------|
| /earthquakes | `aeris.api.Earthquake` | `aeris.api.collection.Earthquakes`|
| /fires | `aeris.api.Fire` | `aeris.api.collection.Fires` |
| /stormreports | `aeris.api.StormReport` | `aeris.api.collection.StormReports` |




## Maps

#### Basic Map Objects

Map objects are rendered and erased using the `setMap` method.

```javascript
var map = new aeris.maps.Map('map-canvas');
var marker = new aeris.maps.Marker({
    position: [45, -90]     // lat lon coordinate
});

marker.setMap(map);         // marker is rendered on the map
marker.setMap(null);        // marker is erased from the map
```

Map objects can be manipulted using **getter** and **setter** methods.

```javascript
var marker = new aeris.maps.Marker({
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
var layer = new aeris.maps.layers.AerisRadar({
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
var marker = new aeris.maps.Marker({
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

Data collections can be bound to collection of markers, allowing you to render point data as markers on a map.

```javascript
var earthquakeCollection = new aeris.api.collection.Earthquakes({
    params: {
        filters: ['moderate', 'strong', 'major'],
        p: map.getBounds();             // only look for earthquakes within the map bounds.
    }
});
var earthquakeMarkers = new aeris.maps.EarthquakeMarkers(null, {
    data: earthquakeCollection          // Bind to earthquakeCollection data
});

earthquakeMarkers.setMap(map);

// Fetch earthquake data from Aeris API
// Markers will be set to the map for every data model fetched.
earthquakeCollection.fetch();


// Look for new earthquakes when the
// map changes location
map.on('change:bounds', function() {
    // Reset the bounds on the earthquake collection
    earthquakeCollection.setParams({
        p: map.getBounds()
    });
    earthquakeCollection.fetch();
});


// Render earthquake data on click
earthquakeMarkers.on('click', function(latLon, marker) {
    var earthquake = marker.getData();
    
    var infoBox = new aeris.maps.InfoBox({
        position: latLon,
        content: myTemplate(earthquake.toJSON());
    });
    infoBox.setMap(map);
});
```


## Geoservices

Aeris Interactive provides wrappers around a number of 3rd party APIs and services. This allows you to easily switch out one service for another, using the same interface.

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

See reference documentation for service documentation.


## AppBuilder

The Aeris AppBuilder is a dead-simple tool for creating a weather map application.

```javascript
new MapApp({
    el: 'myMapApp'      // ID of application container element
    layers: [
        'AerisRadar',
        'AerisSatellite'
    ],
    markers: [
        'EarthquakeMarkers',
        'StormReportMarkers'
    ]
});
```


#### Theming the AppBuilder

To get started, you can use the Aeris Interactive default theme, located at [TBD].

If you'd like to customize the theme, you can bootstrap off of the default theme, which is written using [Sass](http://sass-lang.com/), a CSS precompiler. You can find the default theme in the repo, located at `lib/aeris/builder/maps/theme`.

We use [Compass](http://compass-style.org/) to compile the the sass stylesheets, which is as easy as running:

```
compass compile
```

from the theme directory.

> Written with [StackEdit](https://stackedit.io/).
