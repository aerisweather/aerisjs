({
  baseUrl: '../lib',
  name: 'aeris/loader/loader',
  out: '../build/loader/loader.js',
  wrap: {
    startFile: ['../externals/require.js', 'start.frag.js'],
    endFile: ['end.frag.js']
  },
  //optimize: 'none',
  // Include any commonly referenced module
  include: ['config']
})
