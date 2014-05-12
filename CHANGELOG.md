# 0.7.4

* ADD: Animation method: `setFrom`, `setTo`, `getFrom`, `getTo`
* ADD: New AutoUpdateAnimation object. Automatically updates an animation with new
       tile layers as they become available from the Aeris API tile server.
* MOD: Improvements to animation performance
* FIX: Remove unused dependencies from bower configuration and repo.
* FIX: AnimationSync passes options to component animation objects
* FIX: Fix incorrect unloading of tile objects, which was causing animation
       to stop playing, in some cases.

See git history for a full list of changes.

# 0.7.3

* FIX: Prevent aeris.util from overriding underscore object.
       This fixes issues with clients' underscore templates not
       properly compiling, and prevents custom Aeris.js utlity functions
       from leaking into other users code.

See git history for a full list of changes.

# 0.7.2

* MOD: Remove Handlebars and hbars! dependencies
* MOD: Clean up unused dependencies from bower.json and amd config
* MOD: Update AMD example to use Leaflet
* MOD: Minor changes and clarifications to documentation


# 0.7.1

* FIX: AerisBatchModel handles errors in indiviudal endpoint responses
* FIX: AerisApiModel/Collection objects do not throw an ApiResponseError.
       Errors should be handled by either on `onerror` option for `fetch`,
       or by the promise returned by `fetch`.

# 0.7.0

**BREAKING CHANGES**

* MOD: Animation#getCurrentTime return a date object instead of a timestamp.
* MOD: DateHelper methods return the DateHelper instance, instead of the underlying Date object.

**Other change*

* ADD: Animation#isAnimating method
* MOD: Improve TileAnimation performance, and fix blocking behavior

See git history for a full list of changes.

# 0.6.0

**BREAKING CHANGES**

* MOD: Animations are bound to the layer with which they were created.
* MOD: Remove MapExtensionObject#requestView.
* MOD: Update animation examples

See git history for a full list of changes

### Notes on upgrading to Aeris.js v0.6.0

##### Animations
You can now control an animation using the layer with which it was created. For example:

```javascript
var map = new aeris.maps.Map('map-canvas');
var radar = new aeris.maps.layers.Radar();
var animation = new aeris.maps.animations.TileAnimation(radar);

animation.start();

// animation.setOpacity(0.5);     // this no longer works in v0.6.0

radar.setOpacity(0.5);            // use this instead
radar.setMap(null);               // Removes the animated layer from the map
radar.setMap(map);                // Adds the animated back to the map
```

The same works for AnimationSync objects

```javascript
var map = new aeris.maps.Map('map-canvas');
var radar = new aeris.maps.layers.Radar();
var satellite = new aeris.maps.layers.Satellite();
var animation = new aeris.maps.animations.AnimationSync([radar, satellite]);

radar.setMap(map);
satellite.setMap(map);
animation.start();

radar.setOpacity(0.5);    // Changes the opacity of the radar layer only
                          // (note that this was not possible in v0.5)

radar.setMap(null);       // Removes the radar layer from the map
```

The goal of this change is to better decouple the animation object from the layer objects. Previously, if a layer was being animated, you could not manipulate the base layer without messing up the animation. Now, you can use the base layer the same as before it was animated, and all animation frames will follow suit.


##### requestView

The `requestView` method has been removed from all mapObjects. It was previously recommended to use `mapObject.requestView()` (asynchronous, returns promise) in place of `mapObject.getView()` (synchronous, returns view) because some map objects loaded their view-rendering strategy asynchronously. In v0.6.0, the StrategyObject has been refactored to only load strategies synchronously.

When upgrading to v0.6.0, you will need to replace all calls to `requestView` with calls to `getView`. For example:

```javascript
// In v0.5
mapObject.requestView().
  done(function(view) {
    var mapObjectView = view;
  });


// In v0.6
var mapObjectView = mapObject.getView();
```

# 0.5.1

* MOD: Update demos to use Leaflet,
       or use aeris-gmaps build when not a features are supported.
* ADD: aeris.Model#bindAttributesTo method
* FIX: Use noConflict on underscore
* FIX: Strategy object remove rendered map object view
       on destroy
* FIX: Leaflet strategies clean up view event listeners on destroy.

SEe git history for a full list of changes.

# 0.5.0

**BREAKING CHANGES**

* MOD: Renamed built library files, using an 'aeris-` prefix.
       eg. 'aeris-gmaps.js' instead of 'gmaps.js'
* MOD: Default aeris.js not uses Leaflet, instead of gmaps.

To adapt to breaking changes, make sure you update your links to the Aeris.js library.
If you currently using Google Maps along with the main 'aeris.js' or 'aeris.min.js'
script, you will want to switch to use 'aeris-gmaps.js' or 'aeris-gmaps.min.js'.

# 0.4.3

* ADD: Batch api requests with AerisBatchModel
       see [docs](docs/usage.md#batch-requests) for details
* ADD: AerisApiModel/AerisApiCollection `getAction` and `getEndpoint` methods.
* ADD: Params accept array for 'filter' option.
       (previously only accepted a FilterCollection)
* ADD: AnimationSync accepts an array of layers for `add` and as
       constructor argument.
* MOD: Params do not proxy change events for the nested ChainedQuery
       collection if the query instance is changed.
       (removed bloated code which provided little value, and no documented use)
* MOD: TileAnimations default 'frame' limit set to 10
       (instead of unlimited). Results in faster load time, by default.
       Note: you can set the TileAnimation 'limit' option to null to
       revert to unlimited animation frames.

See git history for a full list of changes.

# 0.4.2

* MOD: Set default Radar zIndex to be above satellite
* FIX: Reset Leaflet map dimensions when element size is set

See git history for a full list of changes.

# 0.4.1

* FIX: Fix aeris.config.setApiSecret
* MOD: aeris.util.template uses '{var}' style delimiters
* FIX: Fix Google ImageMapType zIndex updating
* MOD: Reconfigure layer zIndexes

See commit log for full change list.


# 0.4.0

**BREAKING CHANGES**

* MOD: Move MapApp Builder library to [its own repo](https://github.com/hamweather/aeris-interactive-maps)

# 0.3.9

* FIX: Markers for google maps properly set clickable/draggable attributes
* FIX: Marker clusters for google maps accept 'clusterOptions' object
       from aeris.maps.markercollections.MarkerCollection constructor.
* MOD: Commit bower and node deps to repo

# 0.3.8

* ADD: Improve ability to integrate with existing mapping applications
       see [Integrating with Existing Applications](docs/usage.md#integrating-with-existing-applications)
* MOD: Move jasmine-amd grunt task to its own repo
  at [hamweather/grunt-jasmine-legacy](https://github.com/hamweather/grunt-jasmine-legacy)
* MOD: Update demo docs


# 0.3.7

* MOD: Remove Leaflet from bower dependencies.
       Leaflet bower package is not consumable.
       Use CDN instead.
* FIX: Fix config.setApiSecret
* FIX: Fix AMD demo
* MOD: Add links to demo site and jsFiddle
       to docs. Create demo site /index.html page


# 0.3.6

* FIX: Fix grunt 'gzip' task (was breaking CDN lib)

# 0.3.5

* MOD: CDN library packages are gzip'd before deployment

# 0.3.4

* ADD: Leaflet build package
* FIX: Fix Leaflet library AMD path in build
* MOD: Reorganize AMD package definitions

See git history for a full change list

# 0.3.3

* FIX: Fix casing in AMD path (causing Travis build to break)

# 0.3.2

* ADD: Leaflet support for MarkerCollections
       using the L.MarkerCluster plugin
* MOD: Refactor and clean up utility library
* MOD: Changes to AMD path aliases
* MOD: Minor documentation changes

# 0.3.1

No breaking changes

* MOD: Update aeris.maps.Map documentation, and fix param docs

# 0.3.0

No breaking changes

* ADD: Marker and MarkerCollection added to publicApi
* MOD: Update build documentation, and move to docs/build.md
* MOD: Move *.md docs to docs/ dir (from docs/markdown)
* MOD: Update documentation
* MOD: ViewModel/Collection accepts Backbone.Model/Collection
       as data source (instead of requiring more specific aeris.Model/Collection)

See git history for a full change list.

# 0.2.1

* FIX: Set jQuery dependency version to v1.8.0+, so consumers
       do not need to resolver bower version conflict with
       Backbone.Marionette.
       Note that Aeris.js still supports v2.0+
* MOD: Fixes to travis config

# 0.2.0

* ADD: Partial for Leaflet maps: map, tile layers, markers
       Still no support for: markercollections, polylines, infoboxes
* FIX: Add missing node packages to package.json
* FIX: Add assets to build path
* MOD: Allow attributeTransforms to be set directly on a ViewModel prototype
* MOD: Expose aeris.maps.markerscollections.MarkerCollection
* MOD: Update examples to use aeris.js from CDN
* MOD: Fix travis to autodeploy on hamweather/master
* MOD: Reconfigure and refactor grunt build tasks
* MOD: Minor YUIDoc annotation changes


# v0.1.5

* MOD: Grunt / Travis-CI build and deploy configuration

# v0.1.4

* Fix docs to display correct Aeris.js CDN paths
* Allow use https for accessing Aeris API
* Create Grunt / Travis-CI environment
  with task runners for jasmine/phantomjs testing
  and the closure linter.
* Fix CDN asset path

# v0.1.3

* Create API models/collections for all weather-related Aeris API endpoints
* Refactor Toggle objects, using ToggleBehvaior mixins
* Waypoint 'selected...' attributes for styling selected waypoints
* Clean and refactor MapApp controllers
* Prefix MapApp CSS classes with 'aeris-'
* Optimize Aeris API requests using the SubsetCollection class and client-side filters
* Document mixed-in class members
* Support https Aeris API reqeusts


# v0.1.2

* FilteredCollection class, for creating bound subsets of aers.Collection objects.
* MapApp: Fullscreen module
* Marker#getUrl method
* Minor fixes and improvements to YUIDoc annotations

# v0.1.1

Includes many breaking changes to v0.1.0, including major restructuring of the public API.

* Major renaming and restructuring of namespaces and AMD paths
* Fix and refactor Animation and AnimationSync
* Fix up and uncomment-out specs
* Create basic examples to serve as documentation-in-code
* Major refactor of YUIDoc annotations, to play nice with YUIDoc generator
* Generator scripts for non-YUIDoc themes, using Handlebars and raw parsed data
* Documentation themes for public API, reference API, and a getting started guide (*.md files)
* Update vendor lib versions
* Numerous other small fixes and refactorings

**Available from our CDN:**
http://cdn.aerisjs.com/aeris.js

Documentation is available at http://hamweather.com/docs/aerisjs

# v0.1.0

* Initial commit of AerisJS library