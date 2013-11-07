define([
  'aeris/util',
  'application/module/module',
  'sinon'
], function(_, Module, sinon) {


  describe('A Module', function() {

    describe('start', function() {

      it('should start any specified child modules', function() {
        var ChildModule = function() {
          var child = sinon.createStubInstance(Module);
          spyOn(child, 'start');
          return child;
        };

        var opts = { foo: 'bar' };

        var children = {
          modA: new ChildModule(),
          modB: new ChildModule()
        };

        var module = new Module({
          modules: children
        });

        module.start(opts);

        expect(children.modA.start).toHaveBeenCalledWith(opts);
        expect(children.modB.start).toHaveBeenCalledWith(opts);
      });

    });

  });

});
