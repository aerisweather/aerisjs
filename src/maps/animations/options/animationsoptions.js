define(function() {
  /**
   * @publicApi
   * @class AnimationOptions
   * @namespace aeris.maps.animations.options
   * @static
   */
  var AnimationOptions = {};

  /**
   * @property from
   * @type {number} Lower time bound
   */
  AnimationOptions.from;

  /**
   * @property to
   * @type {number} Upper time bound
   */
  AnimationOptions.to;


  /**
   * @property limit
   * @type {number} Max number of animation frames to load and render.
   */
  AnimationOptions.limit;


  return AnimationOptions;
});
