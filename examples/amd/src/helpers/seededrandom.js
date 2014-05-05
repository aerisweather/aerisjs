define(function() {
  return function seededRandom(seed) {
    var rnd;
    max = 1;
    min = 0;

    seed = (seed * 9301 + 49297) % 233280;
    rnd = seed / 233280;

    return min + rnd * (max - min);
  }
});
