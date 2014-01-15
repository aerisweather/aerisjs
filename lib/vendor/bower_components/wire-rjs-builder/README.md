# wire-rjs-builder
A [requirejs (rjs)](http://requirejs.org/) builder plugin for [Wire.js specs](https://github.com/cujojs/wire).

### Setting up

1. Copy the builder plugin to within your project.
1. Add the builder plugin to your requirejs build paths config.

```javascript
{
	paths: {
		'wire/builder/rjs': 'path/to/wire-rjs-builder/builder'
	}
}
```

See the [rjs-wire example project](https://github.com/pieter-vanderwerff/rjs-wire) for a more detailed example.