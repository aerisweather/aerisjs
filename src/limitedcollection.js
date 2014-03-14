define([
  'aeris/util',
  'aeris/collection',
  'aeris/model',
  'aeris/errors/invalidargumenterror'
], function(_, Collection, Model, InvalidArgumentError) {
  /**
   * Maintains a version of a source collection
   * which is limited to a specified length.
   *
   * @class LimitedCollection
   * @namespace aeris
   * @extends aeris.Collection
   *
   * @constructor
   * @override
   *
   * @throws {aeris.errors.InvalidArgumentError}
   *
   * @param {aeris.Collection} options.sourceCollection
   * @param {number} options.limit
  */
  var LimitedCollection = function(models, options) {
    LimitedCollection.validateConstructorParams_(models, options);

    /**
     * @type {aeris.Collection}
     * @private
     * @property sourceCollection_
     */
    this.sourceCollection_ = options.sourceCollection;


    /**
     * @type {number}
     * @private
     * @property limit_
     */
    this.limit_ = options.limit;


    Collection.apply(this, arguments);

    this.enforceLimit_();

    this.bindToSourceCollection_();
  };
  _.inherits(LimitedCollection, Collection);


  /**
   * @param {?Array.<aeris.Model>=} opt_models
   * @param {Object} options
   *
   * @throws {aeris.errors.InvalidArgumentError}
   * @protected
   * @static
   * @method validateConstructorParams_
   */
  LimitedCollection.validateConstructorParams_ = function(opt_models, options) {
    options || (options = {});

    if (!options.sourceCollection) {
      throw new InvalidArgumentError('A LimitedCollection must be bound to a sourceCollection');
    }

    if (_.isUndefined(options.limit)) {
      throw new InvalidArgumentError('A LimitedCollection must define a limit');
    }

    if (!_.isNumeric(options.limit) || options.limit < 1) {
      throw new InvalidArgumentError(options.limit + ' is not a valid limit');
    }
  };


  /**
   * @private
   * @method bindToSourceCollection_
   */
  LimitedCollection.prototype.bindToSourceCollection_ = function() {
    this.listenTo(this.sourceCollection_, {
      'add remove reset': this.enforceLimit_
    });
  };


  /**
   * @private
   * @method enforceLimit_
   */
  LimitedCollection.prototype.enforceLimit_ = function() {
    var models = this.getSourceModels_(this.limit_);

    this.set(models);
  };


  /**
   * @param {number} count Number of source models to retrieve.
   * @return {Array.<aeris.model>}
   * @private
   * @method getSourceModels_
   */
  LimitedCollection.prototype.getSourceModels_ = function(count) {
    var models = [];
    var doesSourceHaveEnoughModels = this.sourceCollection_.length >= count;
    count = doesSourceHaveEnoughModels ? count : this.sourceCollection_.length;

    _.times(count, function(atIndex) {
      var model = this.sourceCollection_.at(atIndex);

      this.validateModel_(model);

      models.push(model);
    }, this);

    return models;
  };


  /**
   * @param {aeris.Model} model
   *
   * @throws {Error}
   * @private
   * @method validateModel_
   */
  LimitedCollection.prototype.validateModel_ = function(model) {
    if (!(model instanceof Model)) {
      throw new Error(model + ' is not a valid model');
    }
  };


  /**
   * @return {number}
   * @method getSourceLength
   */
  LimitedCollection.prototype.getSourceLength = function() {
    return this.sourceCollection_.length;
  };


  /**
   * @return {aeris.Collection}
   * @method getSourceCollection
   */
  LimitedCollection.prototype.getSourceCollection = function() {
    return this.sourceCollection_;
  };


  return LimitedCollection;
});
