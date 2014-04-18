define([
  'jasmine'
], function(jasmine) {
  var loudspeaker = jasmine.createSpy('loudspeaker').
    andCallFake(function(talker, words) {
      return words.toUpperCase();
    });

  return loudspeaker;
});
