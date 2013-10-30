define([
  'aeris/util',
  'mapbuilder/core/collection/mapobjectstatecollection',
  'vendor/marionette',
  'vendor/handlebars',
  'vendor/text!mapbuilder/core/view/toggle.html.handlebars'
], function(_, MapObjectStateCollection, Marionette, Handlebars, toggleView) {
  /**
   * The MapObjectToggleController controls a toggle UI view (eg. a checkbox or radio),
   * to add and remove items from the application state.
   *
   * @class aeris.builder.maps.core.controller.MapObjectToggleController
   * @extends Marionette.ItemView
   *
   * @param {Object=} opt_options
   * @param {string} opt_options.template Toggle view UI template.
   * @param {aeris.builder.maps.core.collection.MapObjectStateCollection} opt_options.stateItems
   *
   * @constructor
   */
  var MapObjectToggleController = function(opt_options) {
    var options = _.extend({
      template: Handlebars.compile(toggleView),
      events: {
        'change input': this.updateModel_
      },
      ui: {
        selectBtn: 'input'
      },
      stateItems: new MapObjectStateCollection()
    }, opt_options);

    /**
     * @override
     */
    this.events = options.events;


    /**
     * @override
     */
    this.ui = options.ui;


    /**
     * A set of named MapExtObj which are currently being
     * displayed, according to the shared application state.
     *
     * @type {aeris.builder.maps.core.collection.MapObjectStateCollection}
     * @private
     */
    this.stateItems_ = options.stateItems;


    Marionette.ItemView.call(this, options);


    this.bindStateToModel_();
    this.bindModelToState_();
    this.bindModelToView_();
  };
  _.inherits(MapObjectToggleController, Marionette.ItemView);


  /**
   * Update our model to
   * match UI control values.
   *
   * @private
   */
  MapObjectToggleController.prototype.updateModel_ = function() {
    var isSelected = this.ui.selectBtn.prop('checked');
    this.model.set('selected', isSelected);
  };


  /**
   * Bind our application state to our
   * model
   *
   * So that our view changes it's 'selected' state
   * when map objects are add/removed from the application state.
   * 
   * @private
   */
  MapObjectToggleController.prototype.bindStateToModel_ = function() {
    // Set initial model state
    this.stateItems_.each(function(model) {
      if (model.get('name') === this.model.get('name')) {
        this.model.select();
      }
      else {
        this.model.deselect();
      }
    }, this);

    // Listen to state changes
    this.listenTo(this.stateItems_, {
      add: function(model) {
        if (model.get('name') === this.model.get('name')) {
          this.model.select();
        }
      },
      remove: function(model) {
        if (model.get('name') === this.model.get('name')) {
          this.model.deselect();
        }
      }
    });
  };

  /**
   * Bind our model
   * to the application state
   *
   * So that our state changes it's list of visible
   * map objects when our model changes it's selected state.
   *
   * @private
   */
  MapObjectToggleController.prototype.bindModelToState_ = function() {
    this.listenTo(this.model, {
      select: function() {
        this.stateItems_.add({ name: this.model.get('name') });
      },
      deselect: function() {
        this.stateItems_.removeByName(this.model.get('name'));
      }
    });
  };

  /**
   * Bind our model to our html view
   *
   * @private
   */
  MapObjectToggleController.prototype.bindModelToView_ = function() {
    this.listenTo(this.model, 'change', this.render);
  };




  return MapObjectToggleController;
});
