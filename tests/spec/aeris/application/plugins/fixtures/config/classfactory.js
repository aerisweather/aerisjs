define({
  ModelFactory: {
    ClassFactory: {
      module: 'ai/model',
      args: [
        {
          color: 'blue',
          width: 100
        }
      ]
    }
  },

  $plugins: [
    'ai/application/plugins/classfactory'
  ]
})