define([
  'aeris/util',
  'aeris/model'
], function(_, Model) {
  /**
   * @class MockToggle
   */
  var MockToggle = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      selected: false
    });

    Model.call(this, attrs, opt_options);

    spyOn(this, 'select').andCallThrough();
    spyOn(this, 'deselect').andCallThrough();
    spyOn(this, 'toggle').andCallThrough();
    spyOn(this, 'isSelected').andCallThrough();
  };
  _.inherits(MockToggle, Model);

  MockToggle.prototype.jasmineToString = function() {
    return 'MockToggle_' + this.cid;
  };

  MockToggle.prototype.setSelected = function(isSelected) {
    this.set('selected', isSelected);
  };

  MockToggle.prototype.select = function() {
    this.setSelected(true);
    this.trigger('select', this);
  };

  MockToggle.prototype.deselect = function() {
    this.setSelected(false);
    this.trigger('deselect', this);
  };

  MockToggle.prototype.toggle = function() {
    var event;
    this.setSelected(!this.isSelected());

    event = this.isSelected() ? 'select' : 'deselect';
    this.trigger(event, this);
  };

  MockToggle.prototype.isSelected = function() {
    return this.get('selected');
  };

  return MockToggle;
});
