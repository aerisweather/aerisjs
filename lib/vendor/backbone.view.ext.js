/**
 * Extensions for Backbone.View:
 * - named ui elements (borrowed from BB.Marionette)
 * - bind events using named ui elements
 * - bind global events (eg. Backbone.trigger("some:global:event"))
 * - addInitializer method, to prevent overwriting
 *   initialize method in base class (see Jasmine test for example)
 *
 * Copyright (c)2013 Edan Schwartz
 * github.com/eschwartz/backbone.extension
 * www.edanschwartz.com
 *
 * Distributed under MIT license
 */
define([
  'vendor/backbone',
  'vendor/underscore'
], function(Backbone, _) {
  /**
   * Helper functions
   */
  var getValue = function(object, prop) {
    if (!(object && object[prop])) {
      return null;
    }
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  var delegateEventSplitter = /^(\S+)\s*(.*)$/;


  var View_orig = _.extend({}, Backbone.View.prototype);
  _.extend(Backbone.View.prototype, {
    ui: {},


    getEventNamespace: function() {
      return 'delegateEvents' + this.cid;
    },

    // This method binds the elements specified in the "ui" hash inside the view's code with
    // the associated jQuery selectors.
    bindUIElements: function() {
      if (!this.ui) {
        return;
      }

      var that = this;

      if (!this.uiBindings) {
        // We want to store the ui hash in uiBindings, since afterwards the values in the ui hash
        // will be overridden with jQuery selectors.
        this.uiBindings = this.ui;
      }

      // refreshing the associated selectors since they should point to the newly rendered elements.
      this.ui = {};
      _.each(_.keys(this.uiBindings), function(key) {
        var selector = that.uiBindings[key];
        that.ui[key] = that.$el.find(selector);
      });
    },

    // Delegate events with named ui
    delegateEvents: function(events) {
      this.undelegateEvents();

      events || (events = this.events);
      if (!(events)) {
        return;
      }

      var key;
      for (key in events) {
        if (events.hasOwnProperty(key)) {
          // Determine callback method
          var method = events[key];
          if (!_.isFunction(method)) {
            method = this[events[key]];
          }
          if (!method) {
            throw new Error('Method "' + events[key] + '" does not exist');
          }

          // Split up selector and event binding
          var match = key.match(delegateEventSplitter);
          var eventName = match[1];

          // Check for named selector
          if (!this.uiBindings) {
            this.uiBindings = this.ui;
          }
          var selector = (this.uiBindings && _.has(this.uiBindings, match[2])) ? this.uiBindings[match[2]] : match[2];

          // Bind the event to the DOM object
          method = _.bind(method, this);
          eventName += '.' + this.getEventNamespace();

          if (selector === '') {
            this.$el.on(eventName, method);
          } else {
            this.$el.on(eventName, selector, method);
          }
        }
      }
    }
  });

  return Backbone;
});
