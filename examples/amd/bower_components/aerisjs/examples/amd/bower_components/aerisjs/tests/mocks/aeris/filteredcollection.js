define([
  'aeris/collection',
  'mocks/mockfactory'
], function(Collection, MockFactory) {
  var MockFilteredCollection = new MockFactory({
    methods: [
      'setFilter'
    ],
    inherits: Collection,
    constructor: function(opt_models, opt_options) {
      var options = _.defaults(opt_options || {}, {
        filter: function() { return true; }
      });

      this.filter_ = options.filter;
    }
  });

  MockFilteredCollection.prototype.setFilter = function(filter, ctx) {
    this.filter_ = ctx ? filter.bind(ctx) : filter;
  };

  MockFilteredCollection.prototype.getFilter = function() {
    return this.filter_;
  };


  MockFilteredCollection.prototype.isPassingFilter = function(val) {
    return this.filter_(val);
  };


  return MockFilteredCollection;
});
