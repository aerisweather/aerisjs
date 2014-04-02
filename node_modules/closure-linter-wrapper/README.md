# closure-linter-wrapper

[![Build Status](https://travis-ci.org/jmendiara/node-closure-linter-wrapper.png)](https://travis-ci.org/jmendiara/node-closure-linter-wrapper)
[![Dependency Status](https://gemnasium.com/jmendiara/node-closure-linter-wrapper.png)](https://gemnasium.com/jmendiara/node-closure-linter-wrapper)

Node Wrapper to allow access to [Google Closure Linter](https://developers.google.com/closure/utilities/) from NodeJS

As Google Linter is coded in python, you MUST have python installed, and accessible in your PATH.

This wrapper has bundled the Google Closure Linter v2.3.12, with one modification
* Support for `--ignore_errors` flag introduced in [Google Lint v2.3.9 patch by Elad Karako](http://icompile.eladkarako.com/python-patch-ignore-some-of-google-closure-jslinter-gjslint-errors/)
for backwards compatibility with this module v0.2.1. Please, move your code to the closure-linter `--disable` flag introduced in v2.3.10 as `--ignore-errors` will support will be dropped in next medium release.

## Getting Started
Install the module with:
```bash
npm install closure-linter-wrapper
```

Execute the linter
```javascript
var gjslint = require('closure-linter-wrapper').gjslint;
gjslint({
    flags: ['--nojsdoc'],
    src: ['test/files/error.js'],
    reporter: {
      name: 'console'
    }
  }, function(err, result) {
    if (!err) {
      console.log('Everything went fine');
    }
  }
);
```

Execute the automatic style fixer
```javascript
// COMING SOON
```

## Documentation
### Source Files
If you want to specify single source files to be linted, just pass a `src:[Array]` to the gjslint function
```js
gjslint({
    src: ['test/files/baz.js',
      'test/files/foo.js'
    ]
  }, function(err, result) {
    if (!err) {
      console.log('Everything went fine');
    }
  }
```

If you want to lint complete directories (and exclude single files), read about `-r` and `-x` flags below


### Flags
The configuration flags allow you to customize all the behaviour of the linter. The flags are exactly
the same flags you pass to the python linter, plus the flag for ommiting some errors
```js
var gjslint = require('closure-linter-wrapper').gjslint;
var flagsArray = [
  '--nostrict',
  '--nojsdoc',
  '--disable 14'
];
gjslint({flags: flagsArray}, function (err, result){});
```

*TIP*: If you are using JetBrains WebStorm v6, you can enable gjslint. For doing this, you must provide a `config.file` with
the flags passed to your linter. You can rehuse this `config.file` and pass it to this linter, by specifying in the
`--flagfile` flag

#### Flags reference
```
closure_linter.checker:
  --closurized_namespaces: Namespace prefixes, used for testing ofgoog.provide/require
    (default: '')
    (a comma separated list)
  --ignored_extra_namespaces: Fully qualified namespaces that should be not be reported as extra by the linter.
    (default: '')
    (a comma separated list)

closure_linter.common.simplefileflags:
  -e,--exclude_directories: Exclude the specified directories (only applicable along with -r or --presubmit)
    (default: '_demos')
    (a comma separated list)
  -x,--exclude_files: Exclude the specified files
    (default: 'deps.js')
    (a comma separated list)
  -r,--recurse: Recurse in to the subdirectories of the given path;
    repeat this option to specify a list of values

closure_linter.ecmalintrules:
  --custom_jsdoc_tags: Extra jsdoc tags to allow
    (default: '')
    (a comma separated list)

closure_linter.error_check:
  --jslint_error: List of specific lint errors to check. Here is a list of accepted values:
    - all: enables all following errors.
    - blank_lines_at_top_level: validatesnumber of blank lines between blocks at top level.
    - indentation: checks correct indentation of code.
    - well_formed_author: validates the @author JsDoc tags.
    - no_braces_around_inherit_doc: forbids braces around @inheritdoc JsDoc tags.
    - braces_around_type: enforces braces around types in JsDoc tags.
    - optional_type_marker: checks correct use of optional marker = in param types.
    - unused_private_members: checks for unused private variables.
    ;
    repeat this option to specify a list of values
    (default: '[]')
  --[no]strict: Whether to validate against the stricter Closure style. This includes optional_type_marker,
    well_formed_author, no_braces_around_inherit_doc, variable_arg_marker, indentation, braces_around_type,
    blank_lines_at_top_level.
    (default: 'false')

closure_linter.errorrules:
  --disable: Disable specific error. Usage Ex.: gjslint --disable 1,0011 foo.js.
    (a comma separated list)
  --ignore_errors: Disable specific error. Usage Ex.: gjslint --ignore_errors 1,0011 foo.js.
    (default: '')
    (a comma separated list)
  --[no]jsdoc: Whether to report errors for missing JsDoc.
    (default: 'true')
  --max_line_length: Maximum line length allowed without warning.
    (default: '80')
    (a positive integer)

closure_linter.gjslint:
  --additional_extensions: List of additional file extensions (not js) that should be treated as JavaScript files.
    (a comma separated list)
  --[no]beep: Whether to beep when errors are found.
    (default: 'true')
  --[no]check_html: Whether to check javascript in html files.
    (default: 'false')
  -?,--[no]help: show this help
  --[no]helpshort: show usage only for this module
  --[no]helpxml: like --help, but generates XML output
  --[no]multiprocess: Whether to attempt parallelized linting using the multiprocessing module. Enabled by default on
    Linux if the multiprocessing module is present (Python 2.6+). Otherwise disabled by default. Disabling may make
    debugging easier.
    (default: 'false')
  --[no]summary: Whether to show an error count summary.
    (default: 'false')
  --[no]time: Whether to emit timing statistics.
    (default: 'false')
  --[no]unix_mode: Whether to emit warnings in standard unix format.
    (default: 'false')

closure_linter.indentation:
  --[no]debug_indentation: Whether to print debugging information for indentation.
    (default: 'false')

closure_linter.runner:
  --[no]error_trace: Whether to show error exceptions.
    (default: 'false')
  --limited_doc_files: List of files with relaxed documentation checks. Will not report errors for missing
    documentation, some missing descriptions, or methods whose @return tags don't have a matching return statement.
    (default: 'dummy.js,externs.js')
    (a comma separated list)

gflags:
  --flagfile: Insert flag definitions from the given file into the command line.
    (default: '')
  --undefok: comma-separated list of flag names that it is okay to specify on the command line even if the program does
    not define a flag with that name. IMPORTANT: flags in this list that have arguments MUST use the --flag=value
    format.
    (default: '')
```
### Reporters

Some reporters to output lint information are bundled within this module. Add the `reporter: reporterObject`
field to your configuration object passed on execution.
#### Console
Console reporter ouputs info to your console
```js
var gjslint = require('closure-linter-wrapper').gjslint;
gjslint({
    flags: flagsArray
    reporter: {
      name: 'console'
    }
  },
  function (err, result) {
  }
);
```

#### gjslint_xml
The gjslint_xml reporter outputs xml format which is compatible with jslint reporter that can be used in Jenkins along with the Violations plugin.
Add a `dest` option to set the destination if you want to save the file.
```js
var gjslint = require('closure-linter-wrapper').gjslint;
gjslint({
    flags: flagsArray
    reporter: {
      name: 'gjslint_xml',
      dest: 'reports/gjslint.xml'
    }
  },
  function (err, result) {
  }
);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 0.2.9  
  * Update to closure-linter v2.3.12 by @xyzfer

* 0.2.7
  * Update to closure-linter v2.3.11 by @ama-ch

* 0.2.6
  * Fix gjslint_xml reporter to save to an absolute path by @serginator

* 0.2.5
  * Fix windows parsing by @moelders

* 0.2.4
  * new gjslint_xml reporter now saves output to a file by @serginator

* 0.2.3
  * new gjslint_xml reporter by @dciccale

* 0.2.2
  * Introduced support for closure-linter 2.3.10

* 0.2.1
  * gjslint compliance ;)

* 0.2.0 Stable API and Errors
  * Changed the parameters siganture
  * Now, all errors are on err parameter from callback
  * More test!

* 0.1.0 First Implementation
  * gjslint only
  * Console Reporter

## License
Copyright (c) 2013 Javier Mendiara Cañardo
Licensed under the MIT license.
