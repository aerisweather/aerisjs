define([
  'vendor/underscore',
  'testUtils',
  'wire',
  'vendor/backbone'
], function(_, testUtil, wire, Backbone) {
  var plugins = ['application/plugin/events'];

  var Listener = function() {
    this.listen = jasmine.createSpy('Listener#listen');
    this.listenClosely = jasmine.createSpy('Listener#listenHard');
  };
  _.extend(Listener.prototype, Backbone.Events);

  define('listener', function() {
    return Listener;
  });


  var Talker = function() {
  };
  _.extend(Talker.prototype, Backbone.Events);

  define('talker', function() {
    return Talker;
  });


  var throwUncatchable = function(e) {
    _.defer(function() {
      throw e;
    })
  };


  var loudspeaker = jasmine.createSpy('loudspeaker').
    andCallFake(function(talker, words) {
      return words.toUpperCase();
    });
  define('loudspeaker', function() {
    return loudspeaker;
  });


  define('transformers', {
    loudspeaker: loudspeaker,
    muffler: function(talk, words) {
      return words.toLowerCase()
    }
  });





  describe('The wire Event plugin', function() {

    describe('listenTo facet', function () {
      it('should listen to multiple events from multiple emitters', function () {
        wire({
          talkerA: {
            create: 'talker'
          },

          talkerB: {
            create: 'talker'
          },

          listener: {
            create: 'listener',
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
          },
          plugins: plugins
        }).then(function (ctx) {
            ctx.talkerA.trigger('talk', 'hello you');
            expect(ctx.listener.listen).toHaveBeenCalledWith('hello you');

            ctx.talkerA.trigger('whisper', 'hey guy');
            expect(ctx.listener.listenClosely).toHaveBeenCalledWith('hey guy');

            testUtil.setFlag();
          }).otherwise(throwUncatchable);

        waitsFor(testUtil.checkFlag, 1000, 'Wire to complete');
      });


      it('should transform event data', function () {
        wire({
          talker: {
            create: 'talker'
          },

          loudspeaker: { module: 'loudspeaker' },

          listener: {
            create: 'listener',
            listenTo: {
              talker: {
                whisper: 'loudspeaker | listen'
              }
            }
          },

          plugins: plugins
        }).then(function (ctx) {
            ctx.talker.trigger('whisper', ctx.talker, 'hey guy');

            expect(ctx.listener.listen).toHaveBeenCalledWith('HEY GUY');

            testUtil.setFlag();
          }).otherwise(throwUncatchable);

        waitsFor(testUtil.checkFlag, 1000, 'Wire to complete');
      });

      it('should find a transformer within a namespace', function () {
        wire({
          talker: {
            create: 'talker'
          },

          transformers: { module: 'transformers' },

          listener: {
            create: 'listener',
            listenTo: {
              talker: {
                whisper: 'transformers.loudspeaker | listen',
                shout: 'transformers.muffler | listen'
              }
            }
          },

          plugins: plugins
        }).then(function (ctx) {
            ctx.talker.trigger('whisper', ctx.talker, 'hey guy');
            expect(ctx.listener.listen).toHaveBeenCalledWith('HEY GUY');

            ctx.talker.trigger('shout', ctx.talker, 'YO DUDE');
            expect(ctx.listener.listen).toHaveBeenCalledWith('yo dude');

            testUtil.setFlag();
          }).otherwise(throwUncatchable);

        waitsFor(testUtil.checkFlag, 1000, 'Wire to complete');
      });

      it('should clear all listeners when the context is destroyed', function() {
        spyOn(Listener.prototype, 'stopListening');

        wire({
          talkerA: {
            create: 'talker'
          },

          talkerB: {
            create: 'talker'
          },

          listener: {
            create: 'listener',
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
          },
          plugins: plugins
        }).then(function(ctx) {
            return ctx.destroy();
          }).
          then(function() {
            expect(Listener.prototype.stopListening).toHaveBeenCalled();

            testUtil.setFlag();
          }).
          otherwise(throwUncatchable);

        waitsFor(testUtil.checkFlag, 1000, 'Wire to complete');
      });
    });

  });

});
