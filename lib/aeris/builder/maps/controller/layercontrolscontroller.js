define([
  'aeris/util',
  'aeris/controller',
  'aeris/builder/maps/controller/layertogglecontroller',
  'vendor/handlebars',
  'vendor/text!aeris/builder/maps/view/layercontrols.html.handlebars'
], function(_, Controller, LayerToggleController, Handlebars, template) {
  /**
   * @class aeris.builder.maps.controller.LayerControlsController
   * @extends aeris.Controller
   */
  var LayerControlsController = function(opt_options) {
    this.options_ = _.extend({
      layers: []
    }, opt_options);

    this.className = 'aeris-map-controls';

    this.template_ = Handlebars.compile(template);

    Controller.call(this, opt_options);

    this.layers_ = this.options_.layers;
  };
  _.inherits(LayerControlsController, Controller);


  LayerControlsController.prototype.render = function() {
    this.$el.html(this.template_());

    _.each(this.layers_, function(layer) {
      var toggleController = new LayerToggleController({
        layer: layer
      });

      this.$el.append(toggleController.render().$el);
    }, this);

    this.bindUIElements();
    this.delegateEvents();

    return this;
  };


  LayerControlsController.prototype.close = function() {
    this.$el.empty().remove();
    this.undelegateEvents();
  };


  return LayerControlsController;
});
