define(['aeris/util'], function(_) {
  var MockGeolocationError = function(opt_options) {
    return _.defaults(opt_options || {}, {
      message: 'NAVIGATOR_ERROR_MESSAGE',
      code: 12345
    });
  };

  return MockGeolocationError;
});
