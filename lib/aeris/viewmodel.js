define([
  'aeris/util',
  'aeris/model'
], function(_, Model) {
  /**
   * A representation of a data model, which has been
   * reshaped into a form expected by a view.
   *
   * Inspired by https://github.com/tommyh/backbone-view-model
   *
   * @class aeris.ViewModel
   * @extends aeris.Model
   *
   * @constructor
   * @override
   *
   * @param {Object=} opt_attrs
   * @param {Object=} opt_options
   *
   * @param {aeris.Model=} opt_options.data Data model.
  */
  var ViewModel = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      data: new Model(),
      attributeTransforms: {}
    });


    /**
     * Data model.
     *
     * @type {aeris.Model}
     * @private
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
   */
  ViewModel.prototype.syncToModel = function() {
    _.each(this.attributeTransforms_, function(transform, key){
      this.set(key, transform.call(this), { validate: true });
    }, this);
  };


  /**
   * @return {aeris.Model} The data model associated with this view model.
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
   */
  ViewModel.prototype.getDataAttribute = function(path) {
    return this.getData().getAtPath(path);
  };


  /**
   * Invoke the 'fetch' method on our
   * data model.
   *
   * @param {Object=} opt_options Options to pass to the aeris.Model#fetch method.
   * @return {aeris.Promise}
   */
  ViewModel.prototype.fetchData = function(opt_options) {
    return this.data_.fetch(opt_options);
  };


  /**
   * @override
   * Shuts down model-viewModel data bindings.
   */
  ViewModel.prototype.destroy = function() {
    this.stopListening(this.data_);
  };


  return ViewModel;
});
