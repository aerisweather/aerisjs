define([
  'aeris/util',
  'application/form/controller/togglecollectioncontroller',
  'application/form/controller/togglecontroller',
  'aeris/errors/invalidargumenterror'
], function(_, ToggleCollectionController, ToggleController, InvalidArgumentError) {
  /**
   * Controller for a mapControls view,
   * made of {aeris.application.form.controller.ToggleController} views.
   *
   * @class aeris.builder.maps.core.controller.ToggleControlsController
   * @extends aeris.application.form.controller.ToggleCollectionController
   *
   * @constructor
   * @override
   *
   * @param {aeris.Events} options.eventHub Required.
   * @param {string} options.name Required.
  */
  var ToggleControlsController = function(options) {
    options = _.defaults(options || {}, {
      itemView: ToggleController
    });


    if (!options.eventHub) {
      throw new InvalidArgumentError('Missing eventHub parameter for ' +
        'ToggleControlsController constructor')
    }

    /**
     * Application event hub.s
     *
     * @type {aeris.Events}
     * @private
     */
    this.eventHub_ = options.eventHub;


    if (!options.name) {
      throw new InvalidArgumentError('Missing name parameter for ' +
        'ToggleControlsController constructor')
    }


    /**
     * Name of the controls view, as referenced
     * within the builderOptions controls config.
     *
     * @type {string}
     * @private
     */
    this.name_ = options.name;


    ToggleCollectionController.call(this, options);


    this.listenTo(this, {
      render: function() {
        this.eventHub_.trigger('mapControls:ready', this, this.name_);
      }
    })
  };
  _.inherits(ToggleControlsController, ToggleCollectionController);


  return ToggleControlsController;
});
