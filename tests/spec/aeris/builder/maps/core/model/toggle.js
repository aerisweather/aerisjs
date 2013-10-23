define([
  'aeris/util',
  'mapbuilder/core/model/toggle'
], function(_, Toggle) {

  describe('A Toggle', function() {

    beforeEach(function() {
      // Stub out validation
      spyOn(Toggle.prototype, 'isValid');

      // Stub out autoLabel
      spyOn(Toggle.prototype, 'autoLabel');
    });

    describe('constructor', function() {

      it('will immediately validate', function() {
        new Toggle();

        expect(Toggle.prototype.isValid).toHaveBeenCalled();
      });

      it('will auto-set label', function() {
        new Toggle();

        expect(Toggle.prototype.autoLabel).toHaveBeenCalled();
      });

      it('will not auto-set label if autoLabel is disabled', function() {
        new Toggle(null, {
          autoLabel: false
        });

        expect(Toggle.prototype.autoLabel).not.toHaveBeenCalled();
      });

    });

    describe('events', function() {

      it('will always validate on change', function() {
        var toggle = new Toggle();

        toggle.set('name', 'foo');
        expect(toggle.isValid).toHaveBeenCalled();
      });

      it('will auto-set label', function() {
        var toggle = new Toggle();

        toggle.set('name', 'camelCase-name');
        expect(toggle.autoLabel).toHaveBeenCalled();
      });

      it('will not auto-set label if autoLabel is disabled', function() {
        var toggle = new Toggle(null, { autoLabel: false });

        toggle.set('name', 'camelCase-name');
        expect(toggle.autoLabel).not.toHaveBeenCalled();
      });

    });

    describe('validation', function() {

      beforeEach(function() {
        // Run validation
        Toggle.prototype.isValid.andCallThrough();
      });

      it('should require a name', function() {
        expect(function() {
          new Toggle({
            name: undefined,
            bar: 'Foo'
          });
        }).toThrowType('ValidationError');
      });

      it('should require a label', function() {
        expect(function() {
          new Toggle({
            name: 'foo',
            bar: undefined
          }, { autoLabel: false });
        }).toThrowType('ValidationError');
      });

      it('should not require a label is autoLabel option is set', function() {
        new Toggle({
          name: 'foo',
          bar: undefined
        }, { autoLabel: true });
      });

    });

    describe('autoLabel', function() {

      beforeEach(function() {
        // Call original autoLabel
        Toggle.prototype.autoLabel.andCallThrough();
      });

      it('should capitalize the first letter', function() {
        var toggle = new Toggle({
          name: 'foo'
        }, { autoLabel: false });

        toggle.autoLabel();
        expect(toggle.get('label')).toEqual('Foo');
      });

      it('should split camelCase into words', function() {
        var toggle = new Toggle({
          name: 'fooBarFazBaz'
        }, { autoLabel: false });

        toggle.autoLabel();
        expect(toggle.get('label')).toEqual('Foo Bar Faz Baz');
      });

      it('should split dashes and underscores into words', function() {
        var toggle = new Toggle({
          name: 'Foo-Bar_Faz'
        }, { autoLabel: false });

        toggle.autoLabel();
        expect(toggle.get('label')).toEqual('Foo Bar Faz');
      });

      it('should capitalize all words', function() {
        var toggle = new Toggle({
          name: 'foo-bar_faz'
        }, { autoLabel: false });

        toggle.autoLabel();
        expect(toggle.get('label')).toEqual('Foo Bar Faz');
      });

      it('should do it all', function() {
        var toggle = new Toggle({
          name: 'fooBar-fazBaz_YoJo'
        }, { autoLabel: false });

        toggle.autoLabel();
        expect(toggle.get('label')).toEqual('Foo Bar Faz Baz Yo Jo');
      });

      it('should not overwrite an existing label', function() {
        var toggle = new Toggle({
          name: 'fooBar',
          label: 'The Foo Bar'
        }, { autoLabel: false });

        toggle.autoLabel();
        expect(toggle.get('label')).toEqual('The Foo Bar');
      });

      it('should require a name to be set', function() {
        // Allow validation to run.
        Toggle.prototype.isValid.andCallThrough();

        expect(function() {
          var toggle = new Toggle({
            name: undefined,
            label: undefined
          }, { autoLabel: false });

          toggle.autoLabel();
        }).toThrowType('ValidationError');
      });

    });

  });

});
