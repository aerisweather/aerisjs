require([
  '../config-amd',
  'testconfig'
], function() {
  require([
    'jasmine-slow',
    'jasmine-html',
    'matchers/matchers.package',
    'googlemaps!'
  ], function() {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var reporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(reporter);

    jasmineEnv.specFilter = function(spec) {
      return reporter.specFilter(spec);
    };

    jasmine.slow.enable(50);

    require([
      'spec/aeris/model',
      'spec/aeris/collection',
      'spec/aeris/limitedcollection',
      'spec/aeris/filteredcollection',
      'spec/aeris/subsetcollection',
      'spec/aeris/togglebehavior',
      'spec/aeris/togglecollectionbehavior',
      'spec/aeris/viewmodel',
      'spec/aeris/viewcollection',
      'spec/aeris/util',
      'spec/aeris/events',
      'spec/aeris/promise',
      'spec/aeris/emptypromise',
      'spec/aeris/promisequeue',

      'spec/aeris/errors/abstracterror',
      'spec/aeris/errors/errortypefactory',

      'spec/aeris/datehelper',
      'spec/aeris/classfactory',

      'spec/aeris/application/controllers/layoutcontroller',
      'spec/aeris/application/controllers/mixins/viewmixin',
      'spec/aeris/application/controllers/templatehelperregistrars/handlebarstemplatehelperregistrar',
      'spec/aeris/application/models/eventparambag',
      'spec/aeris/application/modules/module',
      'spec/aeris/application/menus/controllers/menucontroller',
      'spec/aeris/application/forms/models/recursivetoggle',
      'spec/aeris/application/forms/models/combotoggle',
      'spec/aeris/application/forms/collections/radiocollection',
      'spec/aeris/application/forms/controllers/togglebuttoncontroller',
      'spec/aeris/application/plugins/events',
      'spec/aeris/application/plugins/classfactory',
      'spec/aeris/application/plugins/attrresolver',
      'spec/aeris/application/plugins/aerisconfig',

      'spec/aeris/builder/appbuilder',
      'spec/aeris/builder/options/appbuilderoptions',

      //'spec/aeris/builder/maps/options/mapappbuilderoptions',
      'spec/aeris/builder/maps/core/helpers/renderer',
      'spec/aeris/builder/maps/core/models/state',
      'spec/aeris/builder/maps/fullscreen/controllers/fullscreenbtncontroller',
      'spec/aeris/builder/maps/fullscreen/controllers/fullscreencontroller',
      'spec/aeris/builder/maps/fullscreen/helpers/fullscreenservice',
      'spec/aeris/builder/maps/fullscreen/modules/fullscreenmodule',
      'spec/aeris/builder/maps/infopanel/helpers/infopanelrenderer',
      'spec/aeris/builder/maps/mapcontrols/controllers/mapcontrolscontroller',

      'spec/aeris/builder/routes/plugins/travelmode',
      'spec/aeris/builder/routes/routebuilder/controllers/controlscontroller',
      'spec/aeris/builder/routes/routebuilder/controllers/routebuildercontroller',
      'spec/aeris/builder/routes/routebuilder/controllers/saveroutecontroller',

      'spec/aeris/geocode/mapquestgeocodeservice',
      'spec/aeris/geocode/googlegeocodeservice',
      'spec/aeris/geolocate/html5geolocateservice',
      'spec/aeris/geolocate/freegeoipgeolocateservice',
      'spec/aeris/geolocate/geolocateserviceresolver',


      //'spec/aeris/commands/abstractcommand',
      //'spec/aeris/commands/commandmanager',

      'spec/aeris/directions/googledirectionsservice',
      'spec/aeris/directions/nonstopdirectionsservice',
      'spec/aeris/directions/helpers/googledistancecalculator',
      'spec/aeris/directions/promises/promisetofetchdirections',
      'spec/aeris/directions/promises/promisetofetchgoogledirections',

      'spec/aeris/helpers/validator/pathvalidator',

      'spec/aeris/api/models/earthquake',
      'spec/aeris/api/models/pointdata',
      'spec/aeris/api/models/stormreport',
      'spec/aeris/api/mixins/aerisapibehavior',
      'spec/aeris/api/params/models/params',
      'spec/aeris/api/params/models/query',
      'spec/aeris/api/models/aerisapimodel',
      'spec/aeris/api/collections/aerisapicollection',
      'spec/aeris/api/collections/aerisapiclientcollection',
      'spec/aeris/api/params/models/filter',
      'spec/aeris/api/params/collections/filtercollection',
      'spec/aeris/api/params/collections/chainedqueries',

      'spec/aeris/maps/map',
      'spec/aeris/maps/extensions/strategyobject',
      'spec/aeris/maps/extensions/mapobjectcollection',
      'spec/aeris/maps/extensions/mapextensionobject',
      'spec/aeris/maps/abstractstrategy',

      'spec/aeris/maps/layers/layer',
      'spec/aeris/maps/layers/abstracttile',
      'spec/aeris/maps/layers/aeristile',
      'spec/aeris/maps/layers/modistile',
      'spec/aeris/maps/layers/seasurfacetemps',


      'spec/aeris/maps/polylines/polyline',

      'spec/aeris/maps/markers/pointdatamarker',
      'spec/aeris/maps/markercollections/markercollection',
      'spec/aeris/maps/markercollections/pointdatamarkers',

      'spec/aeris/maps/animations/abstractanimation',
      'spec/aeris/maps/animations/animationsync',
      'spec/aeris/maps/animations/tileanimation',
      'spec/aeris/maps/animations/helpers/timelayersfactory',
      'spec/aeris/maps/animations/helpers/animationlayerloader',

      'spec/aeris/maps/gmaps/events',
      'spec/aeris/maps/gmaps/abstractstrategy',
      'spec/aeris/maps/gmaps/layers/abstractmaptype',
      'spec/aeris/maps/gmaps/layers/googlemaptype',
      'spec/aeris/maps/gmaps/layers/tile',
      'spec/aeris/maps/gmaps/layers/kml',
      'spec/aeris/maps/gmaps/layers/maptype/imagemaptype',
      'spec/aeris/maps/gmaps/markers/marker',
      'spec/aeris/maps/gmaps/markers/markercluster',


      'spec/aeris/maps/routes/waypoint',
      'spec/aeris/maps/routes/route',
      'spec/aeris/maps/routes/routebuilder',
      'spec/aeris/maps/routes/routerenderer',
      'spec/aeris/maps/routes/commands/abstractroutecommand',
      'spec/aeris/maps/routes/commands/addwaypointcommand',
      'spec/aeris/maps/routes/commands/appendreverseroutecommand',
      'spec/aeris/maps/routes/commands/removewaypointcommand',
      'spec/aeris/maps/routes/commands/resetroutecommand',
      'spec/aeris/maps/routes/commands/reverseroutecommand',
      'spec/aeris/maps/routes/commands/movewaypointcommand',
      'spec/aeris/maps/routes/commands/helpers/routereverser',

      'spec/mocks/require',

      'integration/spec/wire/wire'
    ], function() {
      jasmineEnv.execute();
    });
  });
}, function(e) {
  throw e;
});
