define([
  'aeris/util',
  'aeris/api/collections/pointdatacollection',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/models/earthquake',
  'aeris/datehelper'
], function(_, PointDataCollection, AerisApiClientCollection, Earthquake, DateHelper) {
  /**
   * A representation of earthquake data from the
   * Aeris API 'earthquake' endpoint.
   *
   * @publicApi
   * @class Earthquakes
   * @namespace aeris.api.collections
   * @extends aeris.api.collections.PointDataCollection
   *
   * @constructor
   * @override
   */
  var Earthquakes = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      params: {},
      model: Earthquake,
      endpoint: 'earthquakes',
      action: 'within',
      SourceCollectionType: PointDataCollection
    });

    _.defaults(options.params, {
      from: new DateHelper().addWeeks(-7),
      to: new Date(),
      radius: '3000miles'
    });

    AerisApiClientCollection.call(this, opt_models, options);

    /**
     * @property sourceCollection_
     * @type {aeris.api.collections.PointDataCollection}
     */
  };
  _.inherits(Earthquakes, AerisApiClientCollection);


  return _.expose(Earthquakes, 'aeris.api.collections.Earthquakes');
});
