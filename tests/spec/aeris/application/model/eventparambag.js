define([
  'aeris/util',
  'application/model/eventparambag',
  'aeris/events'
], function(_, EventParamBag, Events) {
  var eventHub;
  var transformer;
  var someObj;

  beforeEach(function() {
    eventHub = new Events();
    someObj = {};

    transformer = {
      loudspeaker: function(obj, words) {
        return words.toUpperCase();
      },
      frame: function(obj, words) {
        return '[ ' + words + ' ]';
      }
    }
  });
  afterEach(function() {
    eventHub.off();
  });


  describe('An EventParamBag', function() {

    describe('constructor', function() {

      it('should set event parameters as attributes', function() {
        var bag = new EventParamBag(undefined, {
          eventHub: eventHub,
          eventParamAttributes: {
            speak: 'spokenWords',
            show: 'seenThings'
          }
        });

        eventHub.trigger('speak', 'Hear the words I speak unto thee.');
        expect(bag.get('spokenWords')).toEqual('Hear the words I speak unto thee.');

        eventHub.trigger('show', 'Something really cool.');
        expect(bag.get('seenThings')).toEqual('Something really cool.');

        // Overwrite attr
        eventHub.trigger('speak', 'Hey there.');
        expect(bag.get('spokenWords')).toEqual('Hey there.');
      });

      it('should use transformers', function() {
        var bag = new EventParamBag(undefined, {
          eventHub: eventHub,
          eventParamAttributes: {
            speak: 'loudspeaker | spokenWords',
            show: 'frame | seenThings'
          },
          eventTransformer: transformer
        });

        eventHub.trigger('speak', someObj, 'Hear the words I speak unto thee.');
        expect(bag.get('spokenWords')).toEqual('HEAR THE WORDS I SPEAK UNTO THEE.');

        eventHub.trigger('show', someObj, 'Something really cool.');
        expect(bag.get('seenThings')).toEqual('[ Something really cool. ]');

        // Overwrite attr
        eventHub.trigger('speak', someObj, 'Hey there.');
        expect(bag.get('spokenWords')).toEqual('HEY THERE.');
      });

      it('should complain if the transformer object doesn\'t exist', function() {
        expect(function() {
          new EventParamBag(undefined, {
            eventHub: eventHub,
            eventParamAttributes: {
              speak: 'loudspeaker | spokenWords',
              show: 'frame | seenThings'
            },
            eventTransformer: null
          });

        }).toThrowType('InvalidArgumentError');

        eventHub.trigger('speak', someObj, 'Heyo.');
      });

      it('should complain if the transformer method doesn\'t exist', function() {
        expect(function() {
          new EventParamBag(undefined, {
            eventHub: eventHub,
            eventParamAttributes: {
              speak: 'ryhmeMachine | spokenWords'
            },
            eventTransformer: transformer
          });
        }).toThrowType('InvalidArgumentError');

        eventHub.trigger('speak', someObj, 'orange');
      });

    });


    describe('stopListening', function() {

      it('should stop listening to the event hub', function() {
        var bag = new EventParamBag({
          spokenWords: 'Hi there.'
        }, {
          eventHub: eventHub,
          eventParamAttributes: {
            speak: 'spokenWords'
          }
        });

        bag.stopListening();

        eventHub.trigger('speak', 'Hear the words I speak unto thee.');
        expect(bag.get('spokenWords')).toEqual('Hi there.');
      });

    });

  });
});
