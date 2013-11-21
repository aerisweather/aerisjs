define([
  'vendor/underscore',
  'when'
], function(_, when) {

  /**
   * Helper class for
   * the listenTo facet.
   *
   * @param proxy
   * @param wire
   *
   * @constructor
   */
  var ListenToFacet = function(proxy, wire) {
    this.listener_ = proxy.target;
    this.spec_ = proxy.options;
    this.wire_ = wire;
  };


  /**
   * Bind event listeners, as
   * defined in the facet spec.
   *
   * @returns {when.promise} A promise to resolve all listeners.
   */
  ListenToFacet.prototype.connect = function() {
    var connectionPromises = [];

    _.each(this.spec_, function(eventSpec, targetRef) {
      connectionPromises.push(this.connectTarget(eventSpec, targetRef))
    }, this);

    return when.all(connectionPromises);
  };


  /**
   * Bind listeners to a target object.
   *
   * @param {Object} eventSpec
   *        As: {
   *             eventName: 'opt_transform | handler',
   *              ...
   *            }
   *
   * @param {string} targetRef Reference to target object
   * @returns {when.promise} Promise to bind target events.
   */
  ListenToFacet.prototype.connectTarget = function(eventSpec, targetRef) {
    var passThrough = function(args) { return args; }
    var whenTargetResolved = this.wire_.resolveRef(targetRef);
    var connectionPromises = [];

    _.each(eventSpec, function(handlerSpec, topic) {
      var whenTransformerResolved;
      var whenConnected;
      var handler;
      var parts = handlerSpec.split('|');

      // HandlerSpec: 'transformer | handler'
      // --> Resolve transformer
      if (parts.length === 2) {
        whenTransformerResolved = this.resolveTransformer(parts[0].trim());
        handler = this.listener_[parts[1].trim()];
      }
      // HandlerSpec: 'handler'
      // --> Use a pass-through transformer
      else {
        whenTransformerResolved = when(passThrough);
        handler = this.listener_[handlerSpec];
      }

      // Transformer and target are resolved
      whenConnected = when.join(whenTargetResolved, whenTransformerResolved).
        then(_.bind(function(refs) {
          var target = refs[0];
          var transformer = refs[1];

          this.listenTo(target, topic, handler, transformer);
        }, this));

      connectionPromises.push(whenConnected);
    }, this);

    return when.all(connectionPromises);
  };

  /**
   * @param {string} transformerSpec As '[opt_ns].transformer'
   * @return {when} Promise to resolve with transformer function.
   */
  ListenToFacet.prototype.resolveTransformer = function(transformerSpec) {
    var specParts = transformerSpec.split('.');
    var nsRef, transformerRef;

    return when.promise(_.bind(function(resolve, reject) {
      // Spec: 'namespace.transformer'
      // --> Resolve namespace reference
      if (specParts.length === 2) {
        nsRef = specParts[0].trim();
        transformerRef = specParts[1].trim();

        this.wire_.resolveRef(nsRef).then(function(ns) {
          resolve(ns[transformerRef]);
        });
      }
      // Spec: 'transformer'
      // --> Resolve transformer reference
      else {
        transformerRef = transformerSpec;
        this.wire_.resolveRef(transformerRef).then(resolve, reject);
      }
    }, this));
  };


  /**
   * Listen to a topic emitted by a target,
   * using a handler and a transformer.
   *
   * @param {Backbone.Events} target
   * @param {string} topic
   * @param {Function} handler
   * @param {Function} transformer
   */
  ListenToFacet.prototype.listenTo = function(target, topic, handler, transformer) {
    this.listener_.listenTo(target, topic, _.bind(function(var_params) {
      var args = _.argsToArray(arguments);
      var tranformedParams = transformer.apply(transformer, args);
      handler.call(this.listener_, tranformedParams);
    }, this))
  };



  /**
   * String#trim method shim
   *
   * From:
   *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
   */
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  return function() {
    return {
      facets: {

        /**
         * ListenTo Facet.
         *
         * Binds a listener object to events thrown
         * by a target object.
         *
         * Both objects must mixin Backbone.Events: this facet
         * uses the Backbone.Events#listenTo / #stopListeningTo
         * methods to bind events.
         *
         * Parameters attached to events can be optionally
         * transformed by transformer methods. Transformer methods
         * receive an array of event parameters, and return a
         * transformed array of arguments to pass on to
         * the event handler.
         *
         * Example:
         *  // Transformer
         *  define('shout', function() {
         *    return function(talker, words) {
         *      return words.toUpperCase();
         *    }
         *  });
         *
         *  wire({
         *    shout: { module: 'shout' },
         *    talker: { create: 'talker' },
         *    listener: {
         *      create: 'listener',
         *      listenTo: {
         *        talker: {
         *          whisper: 'shout | listen'
         *        }
         *      }
         *    }
         *  });
         *
         *  talker.trigger('whisper', talker, 'hello there');
         *  // listener called with: 'HELLO THERE'
         *
         *
         * Transformers can also be referenced from
         * within an object.
         *
         * Example:
         *  define('transformers', {
         *    shout: function(args) { ... }
         *  });
         *
         *  wire({
         *    // ...
         *    transformers: { module: 'transformers' },
         *    listener: {
         *      listenTo: {
         *        talker: {
         *          whisper: 'transformers.shout | listen'
         *        }
         *      }
         *    }
         *  });
         *
         *
         * Transform can be specified as:
         *    'methodName'              // A method defined in the spec.
         *    'otherObj.methodName'     // A method of otherObj (where otherObj is defined in the spec)
         */
        listenTo: {
          ready: function(resolver, proxy, wire) {
            var facet = new ListenToFacet(proxy, wire);
            facet.connect().then(function() {
              resolver.resolve();
            }, resolver.reject);
          },
          destroy: function(resolver, proxy, wire) {
            // This is crude, but it works.
            proxy.target.stopListening();
            resolver.resolve();
          }
        }
      }
    };
  };
});
