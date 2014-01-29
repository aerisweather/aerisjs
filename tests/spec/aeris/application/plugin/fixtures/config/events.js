define({
  multipleEvents: {
    talkerA: { create: '../talker' },
    talkerB: { create: '../talker' },
    listener: {
      create: '../listener',
      listenTo: {
        talkerA: {
          talk: 'listen',
          whisper: 'listenClosely'
        },
        talkerB: {
          talk: 'listen',
          whisper: 'listenClosely'
        }
      }
    }
  },

  transformer: {
    talker: { create: '../talker' },

    loudspeaker: { module: '../loudspeaker' },

    listener: {
      create: '../listener',
      listenTo: {
        talker: {
          whisper: 'loudspeaker | listen'
        }
      }
    }
  },

  transformerNs: {
    talker: { create: '../talker' },

    transformers: { module: '../transformers' },

    listener: {
      create: '../listener',
      listenTo: {
        talker: {
          whisper: 'transformers.loudspeaker | listen',
          shout: 'transformers.muffler | listen'
        }
      }
    }
  },

  plugins: [
    'ai/application/plugin/events'
  ]
});
