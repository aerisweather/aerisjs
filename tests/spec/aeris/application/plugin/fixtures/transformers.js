define([
  './loudspeaker'
], function(loudspeaker) {
  return {
    loudspeaker: loudspeaker,
    muffler: function(talk, words) {
      return words.toLowerCase()
    }
  };
});
