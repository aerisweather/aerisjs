## Using RequireJS

- Must define base 'ai' path
- Must define paths for Aeris deps
- Must define path for map strategy.


```
require.config({
  paths: {
  	// Define aeris base path
    'ai': 'vendor/aeris-interactive/lib/aeris',
    
    // Define aeris maps strategy
    'ai/maps/strategy': 'vendor/aeris-interactive/lib/aeris/maps/gmaps',

	// Define aeris dependencies
    'underscore': 'vendor/underscore',
    'backbone': 'vendor/backbone'
  },
  shim: {  
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore'],
      exports: 'Backbone'
    }
  }
});
```


If `ai` conflicts with a local path (haven't tested this...)

```
require.config({
  paths: {
    'aeris': 'vendor/aeris-interactive/lib/aeris'
  },
  map: {
    aeris: {
      'ai': 'aeris',
      'ai/maps/strategy': 'aeris/maps/gmaps'
    }
  }
});
```