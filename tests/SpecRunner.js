require([
  '../lib/config',
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
      '/tests/lib/domReady.js!',

      'spec/aeris/model',
      'spec/aeris/collection',
      'spec/aeris/limitedcollection',
      'spec/aeris/viewmodel',
      'spec/aeris/viewcollection',
      'spec/aeris/util',
      'spec/aeris/events',
      'spec/aeris/aerisapi',
      'spec/aeris/promise',
      'spec/aeris/emptypromise',
      'spec/aeris/promisequeue',

      'spec/aeris/errors/abstracterror',
      'spec/aeris/errors/errortypefactory',

      'spec/aeris/datehelper',
      'spec/aeris/classfactory',

      'spec/aeris/application/controllers/layoutcontroller',
      'spec/aeris/application/controllers/mixins/viewmixin',
      'spec/aeris/application/controllers/templatehelperregistrar/handlebarstemplatehelperregistrar',
      'spec/aeris/application/models/eventparambag',
      'spec/aeris/application/modules/module',
      'spec/aeris/application/menu/controllers/menucontroller',
      'spec/aeris/application/form/models/recursivetoggle',
      'spec/aeris/application/form/models/combotoggle',
      'spec/aeris/application/form/collections/radiocollection',
      'spec/aeris/application/form/controllers/togglebuttoncontroller',
      'spec/aeris/application/plugin/events',
      'spec/aeris/application/plugin/classfactory',
      'spec/aeris/application/plugin/attrresolver',
      'spec/aeris/application/plugin/aerisconfig',

      'spec/aeris/builder/appbuilder',
      'spec/aeris/builder/options/appbuilderoptions',

      //'spec/aeris/builder/maps/options/mapappbuilderoptions',
      'spec/aeris/builder/maps/core/helpers/renderer',
      'spec/aeris/builder/maps/core/models/state',
      'spec/aeris/builder/maps/mapcontrols/controllers/mapcontrolscontroller',

      'spec/aeris/builder/routes/plugin/travelmode',
      'spec/aeris/builder/routes/routebuilder/controllers/controlscontroller',
      'spec/aeris/builder/routes/routebuilder/controllers/saveroutecontroller',

      'spec/aeris/geocode/mapquestgeocodeservice',
      'spec/aeris/geocode/googlegeocodeservice',
      'spec/aeris/geolocate/html5geolocateservice',
      'spec/aeris/geolocate/freegeoipgeolocateservice',


      //'spec/aeris/commands/abstractcommand',
      //'spec/aeris/commands/commandmanager',

      'spec/aeris/directions/googledirectionsservice',
      'spec/aeris/directions/nonstopdirectionsservice',
      'spec/aeris/directions/helpers/googledistancecalculator',
      'spec/aeris/directions/promise/promisetofetchdirections',
      'spec/aeris/directions/promise/promisetofetchgoogledirections',

      'spec/aeris/helpers/validator/pathvalidator',

      'spec/aeris/api/models/pointdata',
      'spec/aeris/api/params/models/params',
      'spec/aeris/api/params/models/query',
      'spec/aeris/api/models/aerisapimodel',
      'spec/aeris/api/collections/aerisapicollection',
      'spec/aeris/api/params/models/filter',
      'spec/aeris/api/params/collections/filtercollection',
      'spec/aeris/api/params/collections/chainedqueries',

      'spec/aeris/maps/map',
      'spec/aeris/maps/extensions/strategyobject',
      'spec/aeris/maps/extensions/mapobjectcollection',
      'spec/aeris/maps/extensions/mapextensionobject',
      'spec/aeris/maps/abstractstrategy',

      'spec/aeris/maps/layers/abstractlayer',
      'spec/aeris/maps/layers/abstracttile',
      'spec/aeris/maps/layers/aerisinteractivetile',
      'spec/aeris/maps/layers/aerismodistile',
      'spec/aeris/maps/layers/aerisseasurfacetemps',


      'spec/aeris/maps/polylines/polyline',

      'spec/aeris/maps/markers/pointdatamarker',
      'spec/aeris/maps/markercollections/pointdatamarkercollection',

      'spec/aeris/maps/animations/abstractanimation',
      'spec/aeris/maps/animations/animationsync',
      'spec/aeris/maps/animations/aerisinteractivetile',
      'spec/aeris/maps/animations/helpers/timelayersfactory',
      'spec/aeris/maps/animations/helpers/animationlayerloader',

      'spec/aeris/maps/gmaps/events',
      'spec/aeris/maps/gmaps/abstractstrategy',
      'spec/aeris/maps/gmaps/layerstrategies/abstractmaptype',
      'spec/aeris/maps/gmaps/layerstrategies/googlemaptype',
      'spec/aeris/maps/gmaps/layerstrategies/tile',
      'spec/aeris/maps/gmaps/layerstrategies/kml',
      'spec/aeris/maps/gmaps/layerstrategies/maptype/imagemaptype',
      'spec/aeris/maps/gmaps/markerstrategies/markerclusterstrategy',


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

      'tests/integration/spec/wire/wire'
    ], function() {

      // Yes, it's a hack,
      // but it's solving some aweful async
      // loading issues...
      window.setTimeout(function() {
        jasmineEnv.execute();
      }, 500);
    });
  });
}, function(e) {
  throw e;
});
