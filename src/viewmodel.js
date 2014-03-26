define([
  'aeris/util',
  'aeris/model',
  'aeris/errors/invalidargumenterror'
], function(_, Model, InvalidArgumentError) {
  /**
   * A representation of a data model, which has been
   * reshaped into a form expected by a view.
   *
   * Inspired by https://github.com/tommyh/backbone-view-model
   *
   * @class ViewModel
   * @namespace aeris
   * @extends aeris.Model
   *
   * @constructor
   * @override
   *
   * @param {Object=} opt_attrs
   * @param {Object=} opt_options
   *
   * @param {Backbone.Model=} opt_options.data Data model.
  */
  var ViewModel = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      data: new Model(),
      attributeTransforms: this.attributeTransforms
    });


    /**
     * Data model.
     *
     * @type {aeris.Model}
     * @private
     * @property data_
     */
    this.data_ = options.data;


    /**
     * A hash of transforms to apply
     * to attributes.
     *
     * Example:
     *  {
     *    km: function() {
     *      return this.getData().get('miles') * 1.609344;
     *    }
     *  }
     *
     * this.getData().set('miles', 3.0);
     * this.get('km');     // 4.82803
     *
     *
     * @type {Object.<string,Function>}
     * @private
     * @property attributeTransforms_
     */
    this.attributeTransforms_ = options.attributeTransforms;


    Model.call(this, opt_attrs, options);


    this.listenTo(this.data_, {
      change: this.syncToModel
    });
    this.syncToModel();
  };
  _.inherits(ViewModel, Model);


  /**
   * Uses attribute transforms to sync
   * the view model to the data model.
   * @method syncToModel
   */
  ViewModel.prototype.syncToModel = function() {
    _.each(this.attributeTransforms_, function(transform, key) {
      this.set(key, transform.call(this), { validate: true });
    }, this);
  };


  /**
   * @return {aeris.Model} The data model associated with this view model.
   * @method getData
   */
  ViewModel.prototype.getData = function() {
    return this.data_;
  };


  /**
   * Returns an attribute of the data
   * model at a given path.
   *
   * @param {string} path
   * @return {string}
   * @method getDataAttribute
   */
  ViewModel.prototype.getDataAttribute = function(path) {
    var pathParts, baseDataAttr, nestedAttrsPath;

    if (_.isUndefined(path)) {
      throw new InvalidArgumentError('Unable to get data attribute ' + path);
    }

    pathParts = path.split('.');
    baseDataAttr = this.data_.get(pathParts[0]);
    nestedAttrsPath = pathParts.slice(1).join('.');

    return nestedAttrsPath ? _.path(nestedAttrsPath, baseDataAttr) : baseDataAttr;
  };


  /**
   * Invoke the 'fetch' method on our
   * data model.
   *
   * @param {Object=} opt_options Options to pass to the aeris.Model#fetch method.
   * @return {aeris.Promise}
   * @method fetchData
   */
  ViewModel.prototype.fetchData = function(opt_options) {
    return this.data_.fetch(opt_options);
  };


  /**
   * @override
   * Shuts down model-viewModel data bindings.
   * @method destroy
   */
  ViewModel.prototype.destroy = function() {
    this.stopListening(this.data_);
  };


  return ViewModel;
});
