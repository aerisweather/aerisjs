define([
  'ai/util',
  'ai/collection',
  'ai/viewmodel'
], function(_, Collection, ViewModel) {
  /**
   * A representation of a data collection, which has been
   * reshaped into a form expected by a view.
   *
   * @class ViewCollection
   * @namespace aeris
   * @extends aeris.Collection
   *
   * @constructor
   * @override
  */
  var ViewCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      data: new Collection(),
      model: ViewModel
    });


    /**
     * Data collection.
     *
     * @type {aeris.Collection}
     * @private
     * @property data_
     */
    this.data_ = options.data;


    /**
     * A cache of created view model instances,
     * referenced by their associated data model cid.
     *
     * @type {Object.<string,aeris.ViewModel>}
     * @private
     * @property viewModelLookup_
     */
    this.viewModelLookup_ = {};


    Collection.call(this, opt_models, options);


    // Bind to data model
    this.listenTo(this.data_, {
      add: this.addViewModel_,
      remove: this.removeViewModel_,
      reset: this.resetViewModels_
    });

    // Create view models from any
    // existing data models.
    this.resetViewModels_();
  };
  _.inherits(ViewCollection, Collection);


  /**
   * Add a view model.
   *
   * @param {aeris.Model} dataModel The data model to associate with the view model.
   * @private
   * @method addViewModel_
   */
  ViewCollection.prototype.addViewModel_ = function(dataModel) {
    var viewModel = this.createViewModel_(dataModel);

    this.viewModelLookup_[dataModel.cid] = viewModel;

    this.add(viewModel);
  };


  /**
   * Remove a view model.
   *
   * @param {aeris.Model} dataModel The associated data model.
   * @private
   * @method removeViewModel_
   */
  ViewCollection.prototype.removeViewModel_ = function(dataModel) {
    var viewModel = this.viewModelLookup_[dataModel.cid];

    // No ViewModel is associated with
    // this data model.
    if (!viewModel) { return; }

    // Remove the view model
    this.remove(viewModel);
    delete this.viewModelLookup_[dataModel.cid];
  };


  /**
   * Reset view models, to sync up
   * with our data model.
   *
   * @private
   * @method resetViewModels_
   */
  ViewCollection.prototype.resetViewModels_ = function() {
    var viewModels = [];

    // Reset the lookup
    this.viewModelLookup_ = {};

    // Generate view models
    this.data_.each(function(dataModel) {
      var viewModel = this.createViewModel_(dataModel);

      this.viewModelLookup_[dataModel.cid] = viewModel;

      viewModels.push(viewModel);
    }, this);

    // Reset the view collection
    this.reset(viewModels);
  };


  /**
   * Create a view model, associated with
   * a specified data model.
   *
   * @param {aeris.Model} dataModel
   * @return {aeris.ViewModel}
   *
   * @protected
   * @override
   * @method createViewModel_
   */
  ViewCollection.prototype.createViewModel_ = function(dataModel) {
    return this._prepareModel(undefined, _.defaults({}, this.modelOptions_, {
      data: dataModel
    }));
  };


  /**
   * @returns {aeris.Collection}
   * @method getData
   */
  ViewCollection.prototype.getData = function() {
    return this.data_;
  };


  /**
   * @param {Object=} opt_options Options to pass to aeris.Model#fetch
   * @return {aeris.Promise}
   * @method fetchData
   */
  ViewCollection.prototype.fetchData = function(opt_options) {
    return this.data_.fetch(opt_options);
  };


  return ViewCollection;
});
