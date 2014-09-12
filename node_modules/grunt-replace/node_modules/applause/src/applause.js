
/*
 * applause
 *
 * Copyright (c) 2014 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/applause/blob/master/LICENSE-MIT
 */

// dependencies

var _ = require('lodash');
var plugins = require('./plugins');

// private

var createPluginHandler = function (context, opts) {
  return function (plugin) {
    var pattern = context.pattern;
    if (plugin.match(pattern, opts) === true) {
      plugin.transform(pattern, opts, function (items) {
        if (items instanceof Error) {
          throw items;
        } else {
          // store transformed pattern in context
          context.pattern = items;
        }
      });
    } else {
      // plugin doesn't apply
    }
  };
};

var normalize = function (applause, patterns) {
  var opts = applause.options;
  return _.transform(patterns, function (result, pattern) {
    // filter empty patterns
    if (!_.isEmpty(pattern)) {
      var match = pattern.match;
      var replacement = pattern.replacement;
      var expression = false;
      // match check
      if (match !== undefined && match !== null) {
        if (_.isRegExp(match)) {
          expression = true;
        } else if (_.isString(match)) {
          if (match.length > 0) {
            match = new RegExp(opts.prefix + match, 'g');
          } else {
            // empty match
            return;
          }
        } else {
          throw new Error('Unsupported match type (RegExp or String expected).');
        }
      } else {
        throw new Error('Match attribute expected in pattern definition.');
      }
      // replacement check
      if (replacement !== undefined && replacement !== null) {
        if (!_.isFunction(replacement)) {
          if (!_.isString(replacement)) {
            // transform object to string
            replacement = JSON.stringify(replacement);
          } else {
            // easy way
            if (expression === false && opts.preservePrefix === true) {
              replacement = opts.prefix + replacement;
            }
          }
        } else {
          // replace using function return value
        }
      } else {
        throw new Error('Replacement attribute expected in pattern definition.');
      }
      return result.push({
        match: match,
        replacement: replacement
      });
    }
  });
};

var getPatterns = function (applause) {
  var opts = applause.options;
  // shallow patterns
  var patterns = _.clone(opts.patterns);
  // backward compatibility
  var variables = opts.variables;
  if (!_.isEmpty(variables)) {
    patterns.push({
      json: variables
    });
  }
  // intercept errors
  for (var i = patterns.length - 1; i >= 0; i -= 1) {
    var context = {
      pattern: patterns[i]
    };
    // process context with each plugin
    plugins.forEach(createPluginHandler(context, opts));
    // update current pattern
    Array.prototype.splice.apply(patterns, [i, 1].concat(context.pattern));
  }
  if (opts.preserveOrder !== true) {
    // only sort non regex patterns (prevents replace issues like head, header)
    patterns.sort(function (a, b) {
      var x = a.match;
      var y = b.match;
      if (_.isString(x) && _.isString(y)) {
        return y.length - x.length;
      } else if (_.isString(x)) {
        return -1;
      }
      return 1;
    });
  }
  // normalize definition
  return normalize(applause, patterns);
};

// applause

var Applause = function (opts) {
  this.options = _.defaults(opts, {
    patterns: [],
    prefix: opts.usePrefix === false ? '': '@@',
    usePrefix: true,
    preservePrefix: false,
    delimiter: '.',
    preserveOrder: false
  });
};

Applause.prototype.replace = function (contents, process) {
  // prepare patterns
  var patterns = getPatterns(this);
  // by default file not updated
  var updated = false;
  // iterate over each pattern and make replacement
  patterns.forEach(function (pattern) {
    var match = pattern.match;
    var replacement = pattern.replacement;
    // wrap replacement function to add process arguments
    if (_.isFunction(replacement)) {
      replacement = function () {
        var args = Array.prototype.slice.call(arguments);
        return pattern.replacement.apply(this, args.concat(process || []));
      };
    }
    updated = updated || contents.match(match);
    contents = contents.replace(match, replacement);
  });
  if (!updated) {
    return false;
  }
  return contents;
};

// static

Applause.create = function (opts) {
  return new Applause(opts);
};

// expose

module.exports = Applause;
