// Note: this spec can be run using jasmine-node

var createRjsConfig = require('../../../../deployment/scripts/createrjsconfig');

describe('createRjsConfig', function() {
  var PACKAGE_NAME_STUB = 'PACKAGE_NAME_STUB';
  var OUT_DIR_STUB = 'OUT_DIR_STUB';
  var PACKAGES_STUB = ['PKG_STUB_A', 'PKG_STUB_B', 'PKG_STUB_C'];

  it('should return an extend a base config', function() {
    var STUB_BASE_CONFIG = {
      foo: 'bar'
    };

    expect(createRjsConfig(PACKAGE_NAME_STUB, {
      baseConfig: STUB_BASE_CONFIG
    }).foo).toEqual('bar');
  });

  it('should not override original deep nested path properties because of strategy option', function() {
    var STRATEGY_ORIG = 'STRATEGY_ORIG';
    var STUB_BASE_CONFIG = {
      path: {
        'aeris/maps/strategy': STRATEGY_ORIG
      }
    };

    createRjsConfig(PACKAGE_NAME_STUB, {
      baseConfig: STUB_BASE_CONFIG,
      strategy: 'new_strategy'
    });

    expect(STUB_BASE_CONFIG.path['aeris/maps/strategy']).toEqual(STRATEGY_ORIG);
  });

  it('should not overwrite the original base config', function() {
    var STUB_BASE_CONFIG = {
      out: 'foo'
    };

    createRjsConfig(PACKAGE_NAME_STUB, {
      baseConfig: STUB_BASE_CONFIG
    });

    expect(STUB_BASE_CONFIG.out).toEqual('foo');
  });

  it('should set the out path, using the packageName and outDir', function() {
    var config = createRjsConfig(PACKAGE_NAME_STUB, {
      outDir: OUT_DIR_STUB
    });

    expect(config.out).toEqual(OUT_DIR_STUB + '/' + PACKAGE_NAME_STUB + '.js');
  });

  it('should set the minified out path, using the packageName and outDir', function() {
    var config = createRjsConfig(PACKAGE_NAME_STUB, {
      outDir: OUT_DIR_STUB,
      minify: true
    });

    expect(config.out).toEqual(OUT_DIR_STUB + '/' + PACKAGE_NAME_STUB + '.min.js');
  });

  it('should set \'optimize:uglify2\' if minify option is true', function() {
    var config = createRjsConfig(PACKAGE_NAME_STUB, {
      minify: true
    });

    expect(config.optimize).toEqual('uglify2');
  });

  it('should set \'optimize:none\' if minify option is false', function() {
    var config = createRjsConfig(PACKAGE_NAME_STUB, {
      minify: false
    });

    expect(config.optimize).toEqual('none');
  });

  it('should set a start wrapper using the startWrapperTemplate option', function() {
    var START_TEMPLATE_STUB = 'START_TEMPLATE_STUB';
    var config = createRjsConfig(PACKAGE_NAME_STUB, {
      startWrapperTemplate: START_TEMPLATE_STUB
    });

    expect(config.wrap.start).toEqual(START_TEMPLATE_STUB);
  });

  it('should set an end wrapper using the endWrapperTemplate option', function() {
    var END_TEMPLATE_STUB = 'END_TEMPLATE_STUB';
    var config = createRjsConfig(PACKAGE_NAME_STUB, {
      endWrapperTemplate: END_TEMPLATE_STUB
    });

    expect(config.wrap.end).toEqual(END_TEMPLATE_STUB);
  });

  it('should set a start wrapper using the endWrapperTemplate option, with packages data', function() {
    var END_TEMPLATE_STUB = '{{#each packages}}{{this}}{{/each}}';
    var config = createRjsConfig(PACKAGE_NAME_STUB, {
      endWrapperTemplate: END_TEMPLATE_STUB,
      packages: PACKAGES_STUB
    });

    expect(config.wrap.end).toEqual(PACKAGES_STUB.join(''));
  });

  it('should set includes using \'packages\' options', function() {
    var config = createRjsConfig(PACKAGE_NAME_STUB, {
      packages: PACKAGE_NAME_STUB
    });

    expect(config.include).toEqual(PACKAGE_NAME_STUB);
  });

  it('should set a strategy', function() {
    var STRATEGY_STUB = 'STRATEGY_STUB';
    var config = createRjsConfig(PACKAGE_NAME_STUB, {
      strategy: STRATEGY_STUB
    });

    expect(config.paths['aeris/maps/strategy']).toEqual('src/maps/' + STRATEGY_STUB);
  });

  it('should not remove existing baseConfig paths', function() {
    var STRATEGY_STUB = 'STRATEGY_STUB';
    var config = createRjsConfig(PACKAGE_NAME_STUB, {
      strategy: STRATEGY_STUB,
      baseConfig: {
        paths: {
          foo: 'bar'
        }
      }
    });

    expect(config.paths.foo).toEqual('bar');
  });

});
