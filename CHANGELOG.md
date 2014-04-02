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