define([
  'aeris/util',
  'aeris/application/forms/controllers/togglecollectioncontroller',
  'aeris/application/forms/controllers/togglecontroller',
  'aeris/errors/invalidargumenterror',
  'aeris/application/templatehelpers/i18n'
], function(_, ToggleCollectionController, ToggleController, InvalidArgumentError, i18n) {
  /**
   * Controller for a mapControls view,
   * made of {aeris.application.forms.controllers.ToggleController} views.
   *
   * @class ToggleControlsController
   * @namespace aeris.builder.maps.core.controllers
   * @extends aeris.application.forms.controllers.ToggleCollectionController
   *
   * @constructor
   * @override
   *
   * @param {aeris.Events} options.eventHub Required.
   * @param {string} options.name Required.
  */
  var ToggleControlsController = function(options) {
    options = _.defaults(options || {}, {
      itemView: ToggleController,
      handlebarsHelpers: {
        i18n: i18n
      }
    });


    if (!options.eventHub) {
      throw new InvalidArgumentError('Missing eventHub parameter for ' +
        'ToggleControlsController constructor');
    }

    /**
     * Application event hub.s
     *
     * @type {aeris.Events}
     * @private
     * @property eventHub_
     */
    this.eventHub_ = options.eventHub;


    if (!options.name) {
      throw new InvalidArgumentError('Missing name parameter for ' +
        'ToggleControlsController constructor');
    }


    /**
     * Name of the controls view, as referenced
     * within the builderOptions controls config.
     *
     * @type {string}
     * @private
     * @property name_
     */
    this.name_ = options.name;


    ToggleCollectionController.call(this, options);
  };
  _.inherits(ToggleControlsController, ToggleCollectionController);


  /**
   * Fires a 'mapControls:ready' event
   * to the event hub.
   * @method triggerReadyEvent
   */
  ToggleControlsController.prototype.triggerReadyEvent = function() {
    this.eventHub_.trigger('mapControls:ready', this, this.name_);
  };


  return ToggleControlsController;
});
