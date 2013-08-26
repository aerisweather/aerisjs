({
  appDir: '../lib',
  mainConfigFile: '../lib/config.js',
  baseUrl: ".",
  modules: [
    {
      name: 'aeris/builder/route/routeappbuilder'
    }
  ],
  dir: '../build',
  namespace: 'aeris',
  fileExclusionRegExp: '^loader',
  //optimize: 'none'
})