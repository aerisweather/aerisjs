define({
  modelAttr: {
    someModel: {
      create: {
        module: 'ai/model',
        args: [{
          deep: {
            nested: {
              attr: 'value'
            }
          }
        }]

      }
    },

    deepNestedValue: { $ref: 'attr!someModel.deep.nested.attr' },

    undefinedValue: { $ref: 'attr!someModel.foo.bar.waz'}
  },

  plugins: [
    'ai/application/plugin/attrresolver'
  ]
})