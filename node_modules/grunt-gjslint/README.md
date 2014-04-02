# grunt-gjslint

> Validate files with Google Linter.

## Getting Started
This plugin requires Node `~0.8.19` (for managing [peerDependencies](http://blog.nodejs.org/2013/02/07/peer-dependencies/)), Grunt `~0.4.1` and *just* python installed.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gjslint --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gjslint');
```

## The "gjslint" task
Run this task with the `grunt gjslint` command.

### Overview
In your project's Gruntfile, add a section named `gjslint` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gjslint: {
    options: {
      flags: [
        '--disable 220' //ignore error code 220 from gjslint
      ],
      reporter: {
        name: 'console'
      }
    },
    all: {
      src: '<%= jshint.all %>'
    }
  }
})
```

As this is a Multitask, you can specify several targets to be called sharing the same root options

### Documentation
grunt-gjslint uses [node-closure-linter-wrapper](https://github.com/jmendiara/node-closure-linter-wrapper)
to lint files

Please, refer to [node-closure-linter-wrapper documentation](https://github.com/jmendiara/node-closure-linter-wrapper)
for flags and reporter reference.

`options.force` flag is a custom option that when disabled, will not fail the grunt task when python is not installed on
the computer. It defaults to `true`


### Usage Examples

Use a flag file to store the closure-linter flags, and have two different source directories.
Output the lint results to the console. You can use wildcards in file paths.

```js
grunt.initConfig({
  gjslint: {
    options: {
      flags: [
          '--flagfile .gjslintrc' //use flag file
      ],
      reporter: {
        name: 'console' //report to console
      },
      force: false //don't fail if python is not installed on the computer
    },
    lib: {
      src: ['lib/module/**/*.js', 'lib/foo.js'],
    },
    test: {
      src: ['test/*.js'],
    }
  }
})
```



## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* v0.1.4 
  * bug fixing in filenames with whitespaces. Thanks to @moelders

* v0.1.3 
    * bug fixing. Thanks to @dcantelar

* v0.1.0 
  * First version
