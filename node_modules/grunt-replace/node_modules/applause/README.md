# Applause [![Build Status](https://secure.travis-ci.org/outaTiME/applause.png?branch=master)](http://travis-ci.org/outaTiME/applause)

Replace text patterns with a given replacement.

## Install

First make sure you have installed the latest version of [node.js](http://nodejs.org/)
(You may need to restart your computer after this step).

From NPM for use as a command line app:

```shell
npm install applause -g
```

From NPM for programmatic use:

```shell
npm install applause
```

From Git:

```shell
git clone git://github.com/outaTiME/applause
cd applause
npm link .
```

## API Reference

Assuming installation via NPM, you can use `applause` in your application like this:

```javascript
var fs = require('fs');
var Applause = require('applause');
var options = {
  patterns: [
    {
      match: 'foo',
      replacement: 'bar'
    }
  ]
};
var applause = Applause.create(options);
var contents = '@@foo';
var result = applause.replace(contents);
console.log(result); // bar
```

### Applause Options

#### patterns
Type: `Array`

Define patterns that will be used to replace the contents of source files.

#### patterns.match
Type: `String|RegExp`

Indicates the matching expression.

If matching type is `String` we use a simple variable lookup mechanism `@@string` (in any other case we use the default regexp replace logic):

```javascript
{
  patterns: [
    {
      match: 'foo',
      replacement: 'bar'  // replaces "@@foo" to "bar"
    }
  ]
}
```

#### patterns.replacement
Type: `String|Function|Object`

Indicates the replacement for match, for more information about replacement check out the [String.replace].

You can specify a function as replacement. In this case, the function will be invoked after the match has been performed. The function's result (return value) will be used as the replacement string.

```javascript
{
  patterns: [
    {
      match: /foo/g,
      replacement: function () {
        return 'bar'; // replaces "foo" to "bar"
      }
    }
  ]
}
```

Also supports object as replacement (we create string representation of object using [JSON.stringify]):

```javascript
{
  patterns: [
    {
      match: /foo/g,
      replacement: [1, 2, 3] // replaces "foo" with string representation of "array" object
    }
  ]
}
```

[String.replace]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
[JSON.stringify]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

#### patterns.json
Type: `Object`

If an attribute `json` found in pattern definition we flatten the object using `delimiter` concatenation and each key–value pair will be used for the replacement (simple variable lookup mechanism and no regexp support).

```javascript
{
  patterns: [
    {
      json: {
        "key": "value" // replaces "@@key" to "value"
      }
    }
  ]
}
```

Also supports nested objects:

```javascript
{
  patterns: [
    {
      json: {
        "key": "value",   // replaces "@@key" to "value"
        "inner": {        // replaces "@@inner" with string representation of "inner" object
          "key": "value"  // replaces "@@inner.key" to "value"
        }
      }
    }
  ]
}
```

For deferred invocations is possible to define functions:

```javascript
{
  patterns: [
    {
      json: function (done) {
        done({
          key: 'value'
        });
      }
    }
  ]
}
```

#### patterns.yaml
Type: `String`

If an attribute `yaml` found in pattern definition will be converted and then processed like [json attribute](#patternsjson).

```javascript
{
  patterns: [
    {
      yaml: 'key: value'  // replaces "@@key" to "value"
    }
  ]
}
```

For deferred invocations is possible to define functions:

```javascript
{
  patterns: [
    {
      yaml: function (done) {
        done('key: value');
      }
    }
  ]
}
```

#### patterns.cson
Type: `String`

If an attribute `cson` found in pattern definition will be converted and then processed like [json attribute](#patternsjson).

```javascript
{
  patterns: [
    {
      cson: 'key: \'value\''
    }
  ]
}
```

For deferred invocations is possible to define functions:

```javascript
{
  patterns: [
    {
      cson: function (done) {
        done('key: \'value\'');
      }
    }
  ]
}
```

#### variables
Type: `Object`

This is the old way to define patterns using plain object (simple variable lookup mechanism and no regexp support). You can still use this but for more control you should use the new `patterns` way.

```javascript
{
  variables: {
    'key': 'value' // replaces "@@key" to "value"
  }
}
```

#### prefix
Type: `String`
Default: `@@`

The prefix added for matching (prevent bad replacements / easy way).

> This only applies for simple variable lookup mechanism.

#### usePrefix
Type: `Boolean`
Default: `true`

If set to `false`, we match the pattern without `prefix` concatenation (useful when you want to lookup an simple string).

> This only applies for simple variable lookup mechanism.

#### preservePrefix
Type: `Boolean`
Default: `false`

If set to `true`, we preserve the `prefix` in target.

> This only applies for simple variable lookup mechanism and `patterns.replacement` is an string.

#### delimiter
Type: `String`
Default: `.`

The delimiter used to flatten when using object as replacement.

#### preserveOrder
Type: `Boolean`
Default: `false`

If set to `true`, we preserve the patterns definition order, otherwise these will be sorted (in ascending order) to prevent replacement issues like `head` / `header` (typo regexps will be resolved at last).

### Usage Examples

#### Basic

File `src/manifest.appcache`:

```
CACHE MANIFEST
# @@timestamp

CACHE:

favicon.ico
index.html

NETWORK:
*
```

Node:

```js
var fs = require('fs');
var Applause = require('applause');
var options = {
  patterns: [
    {
      match: 'timestamp',
      replacement: new Date().getTime()
    }
  ]
};
var applause = Applause.create(options);
var contents = fs.readFileSync('./src/manifest.appcache', 'utf8');
var result = applause.replace(contents);
console.log(result); // replaced output
```

#### Multiple matching

File `src/manifest.appcache`:

```
CACHE MANIFEST
# @@timestamp

CACHE:

favicon.ico
index.html

NETWORK:
*
```


File `src/humans.txt`:

```
              __     _
   _    _/__  /./|,//_`
  /_//_// /_|///  //_, outaTiME v.@@version

/* TEAM */
  Web Developer / Graphic Designer: Ariel Oscar Falduto
  Site: http://www.outa.im
  Twitter: @outa7iME
  Contact: afalduto at gmail dot com
  From: Buenos Aires, Argentina

/* SITE */
  Last update: @@timestamp
  Standards: HTML5, CSS3, robotstxt.org, humanstxt.org
  Components: H5BP, Modernizr, jQuery, Twitter Bootstrap, LESS, Jade, Grunt
  Software: Sublime Text 2, Photoshop, LiveReload

```

Node:

```js
var fs = require('fs');
var pkg = require('./package.json');
var Applause = require('applause');
var options = {
  patterns: [
    {
      match: 'version',
      replacement: pkg.version
    },
    {
      match: 'timestamp',
      replacement: new Date().getTime()
    }
  ]
};
var applause = Applause.create(options);
var contents = fs.readFileSync('./src/manifest.appcache', 'utf8');
var result = applause.replace(contents);
console.log(result); // replaced output
contents = fs.readFileSync('./src/humans.txt', 'utf8');
result = applause.replace(contents);
console.log(result); // replaced output
```

#### Cache busting

File `src/index.html`:

```html
<head>
  <link rel="stylesheet" href="/css/style.css?rel=@@timestamp">
  <script src="/js/app.js?rel=@@timestamp"></script>
</head>
```

Node:

```js
var fs = require('fs');
var Applause = require('applause');
var options = {
  patterns: [
    {
      match: 'timestamp',
      replacement: new Date().getTime()
    }
  ]
};
var applause = Applause.create(options);
var contents = fs.readFileSync('./src/index.html', 'utf8');
var result = applause.replace(contents);
console.log(result); // replaced output
```

#### Include file

File `src/index.html`:

```html
<body>
  @@include
</body>
```

Node:

```js
var fs = require('fs');
var Applause = require('applause');
var options = {
  patterns: [
    {
      match: 'include',
      replacement: fs.readFileSync('./includes/content.html', 'utf8')
    }
  ]
};
var applause = Applause.create(options);
var contents = fs.readFileSync('./src/index.html', 'utf8');
var result = applause.replace(contents);
console.log(result); // replaced output
```

#### Regular expression

File `src/username.txt`:

```
John Smith
```

Node:

```js
var fs = require('fs');
var Applause = require('applause');
var options = {
  patterns: [
    {
      match: /(\w+)\s(\w+)/,
      replacement: '$2, $1' // replaces "John Smith" to "Smith, John"
    }
  ]
};
var applause = Applause.create(options);
var contents = fs.readFileSync('./username.txt', 'utf8');
var result = applause.replace(contents);
console.log(result); // replaced output
```

#### Lookup for `foo` instead of `@@foo`

Node:

```js
var Applause = require('applause');

// option 1 (explicitly using an regexp)
var applause_op1 = Applause.create({
  patterns: [
    {
      match: /foo/g,
      replacement: 'bar'
    }
  ]
});

// option 2 (easy way)
var applause_op2 = Applause.create({
  patterns: [
    {
      match: 'foo',
      replacement: 'bar'
    }
  ],
  usePrefix: false
});

// option 3 (old way)
var applause_op3 = Applause.create({
  patterns: [
    {
      match: 'foo',
      replacement: 'bar'
    }
  ],
  prefix: '' // remove prefix
});
```

## Command Line

_(Coming soon)_

## Release History

 * 2014-06-10   v0.3.3   Remove node v.8.0 support and third party dependencies updated.
 * 2014-04-18   v0.3.2   JSON / YAML / CSON as function supported. Readme updated (thanks [@milanlandaverde](https://github.com/milanlandaverde)).
 * 2014-03-23   v0.3.1   Readme updated.
 * 2014-03-22   v0.3.0   Performance improvements. Expression flag removed. New pattern matching for CSON object. More test cases, readme updated and code cleanup.
 * 2014-03-21   v0.2.0   Project rename from `pattern-replace` to `applause` (thanks Lady Gaga). Test cases in Mocha and readme updated.
 * 2014-03-11   v0.1.2   New pattern matching for YAML object. New preserveOrder flag.
 * 2014-02-26   v0.1.1   Remove the force flag (only applies in grunt plugin).
 * 2014-02-25   v0.1.0   Initial version.

---

Task submitted by [Ariel Falduto](http://outa.im/)
