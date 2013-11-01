define(['wire'], function(wire) {
  return {
    load: function(name, require, callback /*, config */) {
      // If it's a string, try to split on ',' since it could be a comma-separated
      // list of spec module ids
      var errback_uncatchable = function(e) {
        // Throw uncatchable exception for loaders that don't support
        // AMD error handling.  This will propagate up to the host environment
        setTimeout(function() { throw e; }, 0);
      };
      var errback = callback.error || errback_uncatchable;

      wire(name.split(','), { require: require }).then(callback, errback).
        otherwise(errback_uncatchable);
    }
  };
});