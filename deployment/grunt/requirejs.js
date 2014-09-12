module.exports = function(grunt) {
  var createRjsConfig = require('./scripts/createrjsconfig');

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  return {
    requirejs: {
      options: {
        logLevel: grunt.option('verbose') ? 0 : 2     // 0 = TRACE, 2 = WARN
      },

      'aeris-api': {
        options: createRjsConfig('aeris-api', {
          packages: [
            'aeris/packages/api'
          ],
          outDir: '<%=buildDirs.lib %>'
        })
      },
      'aeris-api.min': {
        options: createRjsConfig('aeris-api', {
          packages: [
            'aeris/packages/api'
          ],
          outDir: '<%=buildDirs.lib %>',
          minify: true
        })
      },

      'aeris-gmaps': {
        options: createRjsConfig('aeris-gmaps', {
          packages: [
            'aeris/packages/gmaps'
          ],
          outDir: '<%=buildDirs.lib %>',
          strategy: 'gmaps'
        })
      },
      'aeris-gmaps.min': {
        options: createRjsConfig('aeris-gmaps', {
          packages: [
            'aeris/packages/gmaps'
          ],
          outDir: '<%=buildDirs.lib %>',
          minify: true,
          strategy: 'gmaps'
        })
      },

      'aeris-gmaps-plus': {
        options: createRjsConfig('aeris-gmaps-plus', {
          packages: [
            'aeris/packages/gmaps',
            'aeris/packages/api',
            'aeris/packages/geoservice'
          ],
          strategy: 'gmaps',
          outDir: '<%=buildDirs.lib %>'
        })
      },
      'aeris-gmaps-plus.min': {
        options: createRjsConfig('aeris-gmaps-plus', {
          packages: [
            'aeris/packages/gmaps',
            'aeris/packages/api',
            'aeris/packages/geoservice'
          ],
          strategy: 'gmaps',
          outDir: '<%=buildDirs.lib %>',
          minify: true
        })
      },

      'aeris-leaflet': {
        options: createRjsConfig('aeris-leaflet', {
          packages: [
            'aeris/packages/leaflet'
          ],
          strategy: 'leaflet',
          outDir: '<%=buildDirs.lib %>'
        })
      },
      'aeris-leaflet.min': {
        options: createRjsConfig('aeris-leaflet', {
          packages: [
            'aeris/packages/leaflet'
          ],
          strategy: 'leaflet',
          outDir: '<%=buildDirs.lib %>',
          minify: true
        })
      },

      'aeris-leaflet-plus': {
        options: createRjsConfig('aeris-leaflet-plus', {
          packages: [
            'aeris/packages/leaflet',
            'aeris/packages/api',

            'aeris/geolocate/freegeoipgeolocateservice',
            'aeris/geolocate/html5geolocateservice',
            'aeris/geocode/mapquestgeocodeservice'
          ],
          strategy: 'leaflet',
          outDir: '<%=buildDirs.lib %>'
        })
      },
      'aeris-leaflet-plus.min': {
        options: createRjsConfig('aeris-leaflet-plus', {
          packages: [
            'aeris/packages/leaflet',
            'aeris/packages/api',

            'aeris/geolocate/freegeoipgeolocateservice',
            'aeris/geolocate/html5geolocateservice',
            'aeris/geocode/mapquestgeocodeservice'
          ],
          strategy: 'leaflet',
          outDir: '<%=buildDirs.lib %>',
          minify: true
        })

      }
    }
  };
};
