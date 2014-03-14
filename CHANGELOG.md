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