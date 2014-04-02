define(function() {
  /**
   * A WireJS resolver plugin
   * which returns a model attr.
   *
   * eg:
   *
   * someModel: {
   *    create: {
   *      module: 'aeris/model',
   *      args: [{
   *        deep: {
   *          nested: {
   *            attr: 'value'
   *          }
   *        }
   *      }]
   *    }
   * },
   *
   * deepNestedValue: { $ref: 'attr!someModel.deep.nested.attr' }     // resolves to 'value'
   *
   * @param {Promise} pluginPromise
   * @param {string} refName
   * @param {Object} refObj
   * @param {Wire} wire
   */
  function attrResolver(pluginPromise, refName, refObj, wire) {
    var pathParts = refName.split('.');
    var modelRef = pathParts.shift();
    var attrPath = pathParts.join('.');

    wire.resolveRef(modelRef).then(function(model) {
        pluginPromise.resolve(model.getAtPath(attrPath));
      }).
      otherwise(function(e) {
        pluginPromise.reject(e);
      });
  }


  return function(pluginOptions) {
    return {
      resolvers: {
        attr: attrResolver
      }
    };
  };
});
