define([
  'aeris/util',
  'base/abstractstrategy',
  'aeris/model'
], function(_, AbstractStrategy, Model) {

  var MockObject = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      map: null
    });

    this.hasMap.andReturn(!!attrs.map);

    Model.call(this, attrs, opt_options);
  };
  _.inherits(MockObject, Model);

  MockObject.prototype.hasMap = jasmine.createSpy('MockObject#hasMap');


  var MockMap = function() {

  };
  MockMap.prototype.getView = jasmine.createSpy('Map#getView');


  describe('An AbstractStrategy', function() {

    describe('constructor', function() {

      it('should bind to the object\'s map', function() {
        var obj = new MockObject();
        var map = new MockMap();

        spyOn(AbstractStrategy.prototype, 'setMap');
        spyOn(AbstractStrategy.prototype, 'remove');

        new AbstractStrategy(obj);

        obj.trigger('map:set', obj, map);
        expect(AbstractStrategy.prototype.setMap).toHaveBeenCalledWith(map);

        obj.trigger('map:remove', obj);
        expect(AbstractStrategy.prototype.remove).toHaveBeenCalled();
      });

      it('should set it\'s map to the object\'s map, if it has one', function() {
        var map = new MockMap();
        var obj = new MockObject({ map: map });

        obj.hasMap.andReturn(true);

        spyOn(AbstractStrategy.prototype, 'setMap');

        new AbstractStrategy(obj);
        expect(AbstractStrategy.prototype.setMap).toHaveBeenCalledWith(map);
      });

    });


    describe('destroy', function() {

      it('should unbind event listeners', function() {
        var strategy = new AbstractStrategy(new MockObject());

        spyOn(strategy, 'stopListening');

        strategy.destroy();
        expect(strategy.stopListening).toHaveBeenCalled();
      });

    });


  });

});
