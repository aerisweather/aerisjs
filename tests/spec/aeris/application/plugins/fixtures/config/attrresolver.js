define({
  modelAttr: {
    someModel: {
      create: {
        module: 'aeris/model',
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
    'aeris/application/plugins/attrresolver'
  ]
})