define([
  'aeris/util',
  'aeris/events',
  'aeris/controller',
  'vendor/jquery',
  'vendor/handlebars',
  'vendor/text!aeris/builder/maps/view/layertoggle.html.handlebars'
], function(_, Events, Controller, $, Handlebars, template) {
  /**
   * @constructor
   * @class aeris.builder.maps.controller.LayerToggleController
   * @extends aeris.Controller
   */
  var LayerToggleController = function(opt_options) {
    this.ui = {
      select: 'input[type=checkbox]'
    };

    this.events = {
      'change select': function(evt) {
        var $input = $(evt.currentTarget);
        topic = $input.prop('checked') ? 'select' : 'deselect';
        Events.publish('layer:' + topic, this.layer_);
      }
    };

    this.className = 'aeris-section';

    this.template_ = Handlebars.compile(template);

    this.layer_ = opt_options.layer;

    Controller.call(this, opt_options);
  };
  _.inherits(LayerToggleController, Controller);


  LayerToggleController.prototype.mapLayerName_ = function(layer) {
    var nameMap = {
      'AerisRadar': 'Radar',
      'AerisSatellite': 'Satellite',
      'AerisSatelliteVisible': 'Visible Satellite',
      'AerisAdvisories': 'Advisories',
      'AerisSeaSurfaceTemps': 'Sea Surface Temps',
      'AerisSnowDepth': 'Snow Depth',
      'AerisTemps': 'Temperatures',
      'AerisWindChill': 'Wind Chill',
      'AerisHumidity': 'Humidity'
    };

    return nameMap[layer.name];
  };


  LayerToggleController.prototype.render = function() {
    var data = {
      name: this.mapLayerName_(this.layer_),
      selected: !!this.layer_.aerisMap
    };

    this.$el.html(this.template_(data));

    this.bindUIElements();
    this.undelegateEvents();
    this.delegateEvents();

    return this;
  };


  LayerToggleController.prototype.close = function() {
    this.$el.empty().remove();
    this.undelegateEvents();
  };

  return LayerToggleController;
});
