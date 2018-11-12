### This library has been deprecated. Please visit (our 2.0 docs)[https://www.aerisweather.com/support/docs/toolkits/aeris-js-sdk/]!

Aeris.js
-----------------

##### A javscript library for maps and weather.

[![Build Status](https://secure.travis-ci.org/aerisweather/aerisjs.png?branch=master)](http://travis-ci.org/hamweather/aerisjs) *master*

[![Build Status](https://secure.travis-ci.org/aerisweather/aerisjs.png?branch=dev)](http://travis-ci.org/hamweather/aerisjs)
 *dev*

# About Aeris.js

The [Aeris Weather API](http://www.hamweather.com/support/documentation/aeris/) is one of the most complete and advanced weather APIs available and quickly gives you access to many different types of weather information. 

Out of the box, Aeris.js provides a suite of tools for rendering weather maps and widgets, using data from the Aeris API. Maps can be rendered using the [Google Maps API](https://developers.google.com/maps/) or [OpenLayers](http://openlayers.org/).

Usage of the Aeris API requires an Aeris API developer account. Visit [hamweather.com](http://www.hamweather.com/products/aeris-api/pricing/) to sign up for a free account.

```
/**
 * Aeris.js is currently in beta release.
 * While we will make our best efforts to maintain a stable API,
 * minor changes may be made to the interface while Aeris.js
 * is in beta release. 
 *
 *
 * We would love to hear your feedback, thoughts, and dreams for
 * this library.
 *
 * Why not open a pull request?!
*/
```

----------


# Documentation

* [Installing Aeris.js](docs/install.md)
* [Basic usage](docs/usage.md)
* [Demos](docs/demos.md)

----------

**TL;DR**
```html
<script type="text/javascript" src="//cdn.aerisjs.com/aeris.js"></script>
<script type="text/javascript">
    var map = new aeris.maps.Map('map-canvas', {
        center: [45, -90],
        zoom: 12
    });
    var radarLayer = new aeris.maps.layers.Radar();
    
    radarLayer.setMap(map);
</script>
```
