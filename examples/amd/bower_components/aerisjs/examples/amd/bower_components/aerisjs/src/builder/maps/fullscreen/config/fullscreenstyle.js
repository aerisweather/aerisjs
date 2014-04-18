define({
  $exports: { $ref: 'fullscreenStyle' },

  // Note that for browsers supporting
  // the fullscreen api, fullscreen
  // styles are defined either by the browser,
  // or using the :-webkit-full-screen CSS rule (webkit only).
  fullscreenStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 0,
    padding: 0,
    'box-sizing': 'border-box'
  }
});
