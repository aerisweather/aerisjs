define([
  'wire!./fixtures/config/events'
], function(ctx) {
  describe('The wire Event plugin', function() {

    describe('listenTo facet', function () {

      it('should listen to multiple events from multiple emitters', function() {
        ctx.multipleEvents.talkerA.trigger('talk', 'hello you');
        expect(ctx.multipleEvents.listener.listen).toHaveBeenCalledWith('hello you');

        ctx.multipleEvents.talkerA.trigger('whisper', 'hey guy');
        expect(ctx.multipleEvents.listener.listenClosely).toHaveBeenCalledWith('hey guy');
      });


      it('should transform event data', function () {
          ctx.transformer.talker.trigger('whisper', ctx.transformer.talker, 'hey guy');

          expect(ctx.transformer.listener.listen).toHaveBeenCalledWith('HEY GUY');
      });

      it('should find a transformer within a namespace', function () {
        ctx.transformerNs.talker.trigger('whisper', ctx.transformerNs.talker, 'hey guy');
        expect(ctx.transformerNs.listener.listen).toHaveBeenCalledWith('HEY GUY');

        ctx.transformerNs.talker.trigger('shout', ctx.transformerNs.talker, 'YO DUDE');
        expect(ctx.transformerNs.listener.listen).toHaveBeenCalledWith('yo dude');
      });
    });

  });

});
