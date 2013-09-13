({
  appDir: '../lib',
  mainConfigFile: '../lib/config.js',
  baseUrl: ".",
  modules: [
    { name: 'aeris/builder/route/routeappbuilder' },
    { name: 'aeris/builder/maps/mapappbuilder' }
  ],
  dir: '../build',
  namespace: 'aeris',
  fileExclusionRegExp: '^loader',
  optimize: 'none'
})