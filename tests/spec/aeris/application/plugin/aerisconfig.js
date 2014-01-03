define([
  'aeris/util',
  'application/plugin/aerisconfig',
  'aeris/config',
  'mocks/aeris/application/plugin/pluginresolver'
], function(_, aerisConfigPlugin, aerisConfig, MockPluginResolver) {

  var ModelSetter = function(model) {
    this.uid_ = _.uniqueId('mockAttribute_');
    this.setAttrs_ = [];
    this.model_ = model;
  }

  ModelSetter.prototype.set = function(attr, value) {
    var mockAttrName = this.getMockAttrName(attr);
    this.model_.set(mockAttrName, value);
    this.setAttrs_.push(mockAttrName);
  };

  ModelSetter.prototype.get = function(attr) {
    return this.model_.get(this.getMockAttrName(attr));
  }

  ModelSetter.prototype.getMockAttrName = function(attr) {
    return this.uid_ + attr;
  }

  ModelSetter.prototype.reset = function() {
    _.each(this.setAttrs_, function(setAttr) {
      this.model_.unset(setAttr);
    }, this);

    this.forgetSetAttrs_();
  }

  ModelSetter.prototype.forgetSetAttrs_ = function() {
    this.setAttrs_.length = 0;
  };



  function getAerisConfigResolver() {
    return aerisConfigPlugin().resolvers.aerisConfig;
  }

  describe('An aerisConfig WireJS resolver plugin', function() {
    var aerisConfigResolver, pluginResolver, aerisConfigSetter;

    beforeEach(function() {
      aerisConfigResolver = getAerisConfigResolver();
      pluginResolver = new MockPluginResolver();
      aerisConfigSetter = new ModelSetter(aerisConfig);
    });

    afterEach(function() {
      aerisConfigSetter.reset();
    });


    it('should return an aerisConfig attribute', function() {
      aerisConfigSetter.set('foo', 'bar');

      aerisConfigResolver(pluginResolver, aerisConfigSetter.getMockAttrName('foo'));
      pluginResolver.shouldHaveResolvedWith('bar');
    });

    it('should reject for attributes which are not set', function() {
      aerisConfigResolver(pluginResolver, 'shoobidoobidoo');

      pluginResolver.shouldHaveRejectedWithErrorType('Error');
    });

  });

});
