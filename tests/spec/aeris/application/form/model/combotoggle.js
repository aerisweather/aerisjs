define([
  'aeris/util',
  'application/form/model/combotoggle',
  'sinon',
  'application/form/model/toggle',
  'aeris/collection',
  'aeris/model'
], function(_, ComboToggle, sinon, Toggle, Collection, Model) {

  var MockToggle = function(opt_attrs) {
    Model.call(this, opt_attrs, {
      idAttribute: 'name'
    });
  };
  _.inherits(MockToggle, Toggle);

  MockToggle.prototype.setSelected = function(isSelected) {
    this.set('selected', isSelected);
  };

  MockToggle.prototype.select = function() {
    this.setSelected(true);
    this.trigger('select');
  };

  MockToggle.prototype.deselect = function() {
    this.setSelected(false);
    this.trigger('deselect');
  };

  MockToggle.prototype.toggle = function() {
    var event;
    this.setSelected(!this.isSelected());

    event = this.isSelected() ? 'select' : 'deselect';
    this.trigger(event);
  };

  MockToggle.prototype.isSelected = function() {
    return this.get('selected');
  };


  var MockSelectedToggle = function() {
    var toggle = new MockToggle();
    toggle.setSelected(true);

    return toggle;
  };

  var MockDeselectedToggle = function() {
    var toggle = new MockToggle();
    toggle.setSelected(false);

    return toggle;
  };


  function getToggleSet(opt_count, opt_attrs) {
    var toggles = [];
    var count = opt_count || 3;

    _.times(count, function() {
      toggles.push(new MockToggle(opt_attrs));
    });

    return toggles
  }

  function getMixedToggleSet() {
    var toggles = getToggleSet(5);
    toggles[0].setSelected(true);
    toggles[1].setSelected(false);
    toggles[2].setSelected(true);
    toggles[3].setSelected(false);
    toggles[4].setSelected(true);

    return toggles;
  }



  function isAllSelected(toggles) {
    var allSelected = true;
    toggles.forEach(function(toggle) {
      if (!toggle.isSelected()) { allSelected = false; }
    });

    return allSelected;
  }

  function isAllDeselected(toggles) {
    var allDeselected = true;
    toggles.forEach(function(toggle) {
      if (toggle.isSelected()) { allDeselected = false; }
    });

    return allDeselected;
  }


  describe('A ComboToggle', function() {
    var combo;

    beforeEach(function() {
      combo = new ComboToggle();
    });


    describe('validate', function() {

      it('should reject invalid childToggles', function() {
        var combo = new ComboToggle(undefined, {
          childTogglesAttribute: 'myToggles'
        });

        _.each([
          ['foo', 'bar'],
          [1, 2, 3],
          [new Date()],
          new MockToggle(),
          new Model(),
          [new Model()],
          [new MockToggle(), new Model()]
        ], function(invalidToggles) {
          expect(function() {
            combo.set('myToggles', invalidToggles, { validate: true });
          }).toThrowType('ValidationError');
        });
      });

    });

    describe('select', function() {

      it('should select all toggles on select', function() {
        var toggles = new getMixedToggleSet();
        combo.deselect();
        combo.addToggles(toggles);

        combo.select();
        expect(isAllSelected(toggles)).toEqual(true);
      });
    });

    describe('deselect', function() {

      it('should deselect all child toggles on deselect', function() {
        var toggles = new getMixedToggleSet();
        combo.select();
        combo.addToggles(toggles);

        combo.deselect();
        expect(isAllDeselected(toggles)).toEqual(true);
      });

    });


    describe('addToggles', function() {

      it('should add an array of Toggle models', function() {
        var togglesA = getToggleSet(3);
        var togglesB = getToggleSet(3);
        var combo = new ComboToggle();

        combo.addToggles(togglesA);
        expect(combo.get('childToggles')).toEqual(togglesA);

        combo.addToggles(togglesB);
        expect(combo.get('childToggles')).toEqual(togglesA.concat(togglesB));
      });

      it('should add the toggles to the specified childTogglesAttribute', function() {
        var toggles = getToggleSet();
        var combo = new ComboToggle(undefined, {
          childTogglesAttribute: 'myToggles'
        });

        combo.addToggles(toggles);
        expect(combo.get('myToggles')).toEqual(toggles);
      });

      it('should add all Toggle models in a ToggleCollection', function() {
        var toggleCollectionA = new Collection(getToggleSet(3));
        var toggleCollectionB = new Collection(getToggleSet(3));
        var combo = new ComboToggle();

        combo.addToggles(toggleCollectionA);
        expect(combo.get('childToggles')).toEqual(toggleCollectionA.models);

        combo.addToggles(toggleCollectionB);
        expect(combo.get('childToggles')).toEqual(toggleCollectionA.models.concat(toggleCollectionB.models));
      });

      it('should not add duplicate child Toggle models', function() {
        var toggles = getToggleSet(3);
        var combo = new ComboToggle();

        combo.addToggles(toggles);
        combo.addToggles([toggles[1]]);

        expect(combo.get('childToggles')).toEqual(toggles);
      });

      it('should not change the combo Toggle state', function() {
        var toggles = getToggleSet(3);
        var combo = new ComboToggle();
        combo.addToggles(toggles);

        // Maintains selected state
        combo.select();
        combo.addToggles([new MockDeselectedToggle()]);
        expect(combo.isSelected()).toEqual(true);

        // Maintains deselected state
        combo.deselect();
        combo.addToggles([new MockSelectedToggle()]);
        expect(combo.isSelected()).toEqual(false);

        // Maintains original state
        combo = new ComboToggle();
        combo.select();
        combo.addToggles([new MockDeselectedToggle()]);
        expect(combo.isSelected()).toEqual(true);
      });

      it('should set the added toggles to the parent state', function() {
        var combo, toggles;

        function getMixedToggleSet() {
          var toggles = getToggleSet(3);
          toggles[0].setSelected(true);
          toggles[1].setSelected(false);
          toggles[2].setSelected(true);

          return toggles;
        }

        combo = new ComboToggle();
        toggles = getMixedToggleSet();
        combo.select();
        combo.addToggles(toggles);
        expect(isAllSelected(toggles)).toEqual(true);

        combo.deselect();
        toggles = getMixedToggleSet();
        combo.addToggles(toggles);
        expect(isAllSelected(toggles)).toEqual(false);
      });

    });


    describe('clearToggles', function() {
      var combo = new ComboToggle();
      combo.addToggles(getToggleSet(3));

      combo.clearToggles();
      expect(combo.getChildToggles().length).toEqual(0);
    });

  });

});
