module.exports = {
  init: function(grunt) {
    var phantomjs = require('grunt-lib-phantomjs').init(grunt);
    var chalk = require('chalk');
    var when = require('when');
    var _ = require('underscore');

    var phantomJSSpecRunner = {
      run: function(url) {
        var promiseToRunSpecsDeferred = when.defer();

        bindPhantomEvents({
          'fail.load': function(url) {
            handleFail('PhantomJS unable to load url: ' + url);
          },
          'fail.timeout': _.partial(handleFail, 'PhantomJS timed out.'),
          'console': function(msg) {
            grunt.log.warn('CONSOLE: ' + msg);
          },
          'jasmine.error': function(msg) {
            handleFail(msg);
          },
          'jasmine.start': logStart,
          'jasmine.specResult': logSpecResult,
          'jasmine.runnerResult': logRunnerResults,
          'jasmine.done': function(isPassing) {
            phantomjs.halt();
            promiseToRunSpecsDeferred.resolve(isPassing);
          }
        });

        runPhantomJS(url);

        return promiseToRunSpecsDeferred.promise;




        function bindPhantomEvents(events) {
          _.each(events, function(handler, topic) {
            phantomjs.on(topic, handler);
          });
        }

        function runPhantomJS(url) {
          phantomjs.spawn(url, {
            options: {
              timeout: 3000
            },
            done: function() {
            }
          });
        }


        function handleFail(msg) {
          promiseToRunSpecsDeferred.reject(msg);
          phantomjs.halt();
        }

        function log(msg) {
          grunt.log.writeln('log: ' + msg);
        }

        function logStart(specCount) {
          logLineBreak();
          grunt.log.ok(chalk.cyan('Running ' + specCount + ' tests...'));
        }

        function logSpecResult(specDescr, isPassing) {
          grunt.log.write(isPassing ? chalk.green('.') : chalk.red('X'));
        }


        function logRunnerResults(results) {
          var isPassing = results.passedCount === results.totalCount;

          var message = ('Test results: {passedCount} / {totalCount} expectations passing ' +
            'in {seconds}s.').
            replace('{passedCount}', results.passedCount).
            replace('{totalCount}', results.totalCount).
            replace('{seconds}', (results.time / 1000).toFixed(2));

          logLineBreak(2);

          if (isPassing) {
            grunt.log.ok(chalk.green(message));
          }
          else {
            grunt.log.error(chalk.red(message));
            logFailedSpecs(results.failedSpecs);
          }

          logLineBreak(2);
        }


        function logFailedSpecs(failedSpecs) {
          failedSpecs.forEach(function(spec) {
            var msg = chalk.yellow(spec.fullName);

            spec.items.forEach(function(item) {
              msg += '\n> ' + (item.trace || item.message);
            });

            logLineBreak(1, true);
            grunt.verbose.writeln(msg);
          });
        }

        function logLineBreak(opt_count, opt_isVerbose) {
          var count = opt_count || 1;

          for (var i = 0; i < count; i++) {
            if (opt_isVerbose) {
              grunt.verbose.write('\n');
            }
            else {
              grunt.log.write('\n');
            }
          }
        }
      }
    };

    return phantomJSSpecRunner;
  }
};