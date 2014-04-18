define([
  'aeris/util',
  'aeris/model',
  'aeris/errors/invalidargumenterror'
], function(_, Model, InvalidArgumentError) {
  /**
   * A property bag of parameters passed with events.
   *
   * Model attributes may be bound to events. For example:
   *
   *  var bag = new EventParamBag(undefined, {
   *    eventParamAttributes: {
   *      speak: 'loudspeaker | words'      // Transformer is optional
   *    },
   *    eventHub: person,
   *    eventTransformer: {
   *      loudspeaker: function(person, words) {
   *        return words.toUpperCase()
   *      }
   *    }
   *  });
   *
   *  person.trigger('speak', person, 'hello there');
   *  bag.get('words')     // 'HELLO THERE'
   *
   * @class EventParamBag
   * @namespace aeris.builder.maps.core.models
   * @extends aeris.Model
   *
   * @constructor
   * @override
   *
   * @param {Object.<string,Function>=} options.eventTransformer
   * @param {aeris.Events} options.eventHub Required.
   * @param {Object=} options.eventParamAttributes
  */
  var EventParamBag = function(opt_attrs, options) {
    options = _.defaults(options || {}, {
      eventParamAttributes: {},
      eventTransformer: {}
    });


    /**
     * Used to transform event arguments.
     *
     * @type {Object.<string,Function>}
     * @private
     * @property eventTransformer_
     */
    this.eventTransformer_ = options.eventTransformer;


    /**
     *
     * @type {aeris.Events}
     * @private
     * @property eventHub_
     */
    this.eventHub_ = options.eventHub;

    _.each(options.eventParamAttributes, this.bindEventParamAttributes_, this);

    Model.call(this, opt_attrs, options);
  };
  _.inherits(EventParamBag, Model);


  /**
   * @throws {aeris.errors.InvalidArgumentError} If transform method does not exist.
   *
   * @param {string} attrSpec As 'attrName' or 'tranform | attrName'.
   * @param {string} topic
   * @private
   * @method bindEventParamAttributes_
   */
  EventParamBag.prototype.bindEventParamAttributes_ = function(attrSpec, topic) {
    var stubTransform = function(args) { return args; };
    var parts = attrSpec.split(' | ');
    var attr, transform;

    if (parts.length > 1) {
      if (!this.eventTransformer_ || !_.isFunction(this.eventTransformer_[parts[0]])) {
        throw new InvalidArgumentError(parts[0] + ' is not a valid transform method');
      }

      transform = this.eventTransformer_[parts[0]];
      attr = parts[1];
    }
    else {
      transform = stubTransform;
      attr = parts[0];
    }

    this.listenTo(this.eventHub_, topic, function() {
      var args = _.argsToArray(arguments);
      var tranformedParams = transform.apply(this.eventTransformer_, args);

      // Expose transformed arguments
      this.set(attr, tranformedParams, { validate: true });
    });
  };


  return EventParamBag;
});
