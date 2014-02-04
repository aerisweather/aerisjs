Aeris Interactive
-----------------

##### A javscript library for maps and weather.

# About Aeris Interactive

The [Aeris Weather API](http://www.hamweather.com/support/documentation/aeris/) is one of the most complete and advanced weather APIs available and quickly gives you access to many different types of weather information. 

Out of the box, Aeris Interactive provides a suite of tools for rendering weather maps and widgets, using data from the Aeris API. Maps can be rendered using the [Google Maps API](https://developers.google.com/maps/) or [OpenLayers](http://openlayers.org/).

Usage of the Aeris API requires an Aeris API developer account. Visit [hamweather.com](http://www.hamweather.com/products/aeris-api/pricing/) to sign up for a free account.

```
/**
 * Aeris interactive is currently in beta release.
 * While we will make our best efforts to maintain a stable API,
 * minor changes may be made to the interface while Aeris Interactive
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

* [Installing Aeris Interactive](docs/install.md)
* [Basic usage](docs/usage.md)
* Example code and apps (TODO)
* Reference documentation (TODO)

----------

**TL;DR**
```html
<script type="text/javascript" src="[[CDN TBD]]"></script>
<script type="text/javascript">
    var map = new aeris.maps.Map('map-canvas', {
        center: [45, -90],
        zoom: 12
    });
    var radarLayer = new aeris.maps.layers.AerisRadar();
    
    radarLayer.setMap(map);
</script>
```


----------

> Written with [StackEdit](https://stackedit.io/).
