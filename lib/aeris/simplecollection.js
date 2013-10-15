define([
  'aeris/util',
  'aeris/collection',
  'aeris/simplemodel'
], function(_, BaseCollection, SimpleModel) {
  /**
   * A SimpleCollection represents a simple collection
   * of any type of objects.
   *
   * For example:
   *
   *  var collection = new SimpleCollection(['a', 'b', 'c']);
   *  collection.at(1);   // 'b'
   *  collection.add('d');
   *
   *  collection.on('remove', function() {
   *    arguments; // 'd', collection, [options]
   *  });
   *  collection.remove('d');
   *
   * Essentially, a SimpleCollection is an array with
   * events, following the aeris.Collection interface.
   *
   * @class aeris.SimpleCollection
   * @extends aeris.Collection
   *
   * @constructor
   */
  var SimpleCollection = function() {
    this.model = SimpleModel;

    BaseCollection.apply(this, arguments);
  };
  _.inherits(SimpleCollection, BaseCollection);


  /**
   * @override
   * @return {Array.<*>} Returns an array of values.
   */
  SimpleCollection.prototype.toJSON = function() {
    var arr = [];
    this.each(function(model) {
      arr.push(model.getValue());
    }, this);

    return arr;
  };


  /**
   * Converts simple values to models
   * before calling base collection method.
   *
   * @override
   */
  SimpleCollection.prototype.add = function(simples, options) {
    var toAdd = [];

    // Get rid of duplicate models
    _.each(this.toModel_(simples), function(model) {
      var collectionDups = this.where({
        value: model.get('value')
      });
      var toAddDups = _.filter(toAdd, function(added) {
        return added.get('value') === model.get('value');
      });

      if (!collectionDups.length && !toAddDups.length) {
        toAdd.push(model);
      }
    }, this);

    return BaseCollection.prototype.add.call(this, toAdd, options);
  };


  /**
   * Converts any simple values to
   * their corresponding models before removing.
   *
   * @override
   */
  SimpleCollection.prototype.remove = function(simples, options) {
    var toRemove = [];

    _.isArray(simples) || (simples = [simples]);

    _.each(simples, function(simple) {
      if (simple instanceof this.model) {
        toRemove.push(simple);
      }
      else {
        // Find models with matching values
        toRemove = toRemove.concat(this.where({
          value: simple
        }));
      }
    }, this);

    BaseCollection.prototype.remove.call(this, toRemove, options);
  };


  /**
   *
   * @param {Array.<aeris.SimpleModel|*>|aeris.SimpleModel|*} simples
   *        One or more objects which are either SimpleModels or simple model values.
   * @return {Array.<aeris.SimpleModel>}
   * @private
   */
  SimpleCollection.prototype.toModel_ = function(simples) {
    var models = [];

    _.isArray(simples) || (simples = [simples]);

    _.each(simples, function(prim) {
      models.push(this.toModelSingle_(prim));
    }, this);

    return models;
  };


  /**
   * Converts an array of models or values into a values-only array.
   *
   * @param {Array.<aeris.SimpleModel|*>|aeris.SimpleModel|*} simples
   * @return {Array.<*>}
   * @private
   */
  SimpleCollection.prototype.toValues_ = function(simples) {
    var values = [];

    _.isArray(simples) || (simples = [simples]);

    _.each(simples, function(ss) {
      var val = (ss instanceof SimpleModel) ? ss.getValue() : ss;
      values.push(val);
    }, this);

    return values;
  };


  /**
   *
   * @param {aeris.SimpleModel|*} simple
   *        Either a SimpleModel or a simple model value.
   * @return {aeris.SimpleModel}
   * @private
   */
  SimpleCollection.prototype.toModelSingle_ = function(simple) {
    var model;

    if (simple instanceof this.model) {
      model = simple;
    }
    else {
      model = new this.model(simple);
    }

    return model;
  };


  return SimpleCollection;
});
