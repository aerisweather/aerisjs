// jasmine-context 0.1
// https://github.com/rallysf/jasmine-context
//
// see pull request to remove jQuery dependency:
//  https://github.com/rallysf/jasmine-context/pull/3
//
// Copyright 2013 Rally.org
// Released under the MIT license
beforeEach(function() {
  var jQueryEquals = function(actual, expected) {
    if (!window.jQuery) { return false; }

    var normalizeObjects = function(objects) {
      return (objects instanceof jQuery) ? objects.toArray() : [objects];
    };

    actual = normalizeObjects(actual);
    var isSubset = true;
    jQuery.each(normalizeObjects(expected), function(index, item) {
      isSubset = isSubset && actual.indexOf(item) >= 0;
    });
    return isSubset;
  };

  this.addMatchers({
    toHaveBeenCalledInTheContextOf: function(expectedObject, expectedArgs) {
      var spy = this.actual;

      if (!jasmine.isSpy(spy)) {
        throw new Error('Expected a spy, but got ' + jasmine.pp(spy) + '.');
      }

      if (expectedObject === undefined || window.jQuery && expectedObject instanceof jQuery && expectedObject.length === 0) {
        throw new Error('Expected a context for ' + jasmine.pp(spy) + ', but got ' + jasmine.pp(expectedObject) + '.');
      }

      this.message = function() {
        if (this.actual.callCount === 0 && !this.isNot) {
          return 'Expected spy ' + this.actual.identity + ' to have been called in the context of ' + jasmine.pp(expectedObject) +
            ', but the spy was never called';
        }
        if (this.actual.callCount > 0 && this.isNot) {
          return 'Expected spy ' + this.actual.identity + ' not to have been called in the context of ' + jasmine.pp(expectedObject) +
            ', but the spy was called';
        }

        if (expectedArgs === undefined) {
          return [
            'Expected spy ' + this.actual.identity + ' to have been called in the context of ' + jasmine.pp(expectedObject),
            'Expected spy ' + this.actual.identity + ' not to have been called in the context of ' + jasmine.pp(expectedObject)
          ];
        } else {
          return [
            'Expected spy ' + this.actual.identity + ' to have been called in the context of ' + jasmine.pp(expectedObject) + ' with arguments ' + jasmine.pp(expectedArgs),
            'Expected spy ' + this.actual.identity + ' not to have been called in the context of ' + jasmine.pp(expectedObject) + ' with arguments ' + jasmine.pp(expectedArgs)
          ];
        }
      };

      for (var i = 0; i < spy.calls.length; i++) {
        var objectMatches = spy.calls[i].object === expectedObject || jQueryEquals(spy.calls[i].object, expectedObject);
        var argsMatches = expectedArgs === undefined || this.env.equals_(spy.calls[i].args, expectedArgs);
        if (objectMatches && argsMatches) {
          return true;
        }
      }
      return false;
    }
  });
});
