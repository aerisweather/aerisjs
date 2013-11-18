define([
  'aeris/util',
  'aeris/viewcollection',
  'aeris/viewmodel',
  'aeris/collection',
  'aeris/model'
], function(_, ViewCollection, ViewModel, Collection, Model) {
  var MockViewModel;


  beforeEach(function() {
    MockViewModel = jasmine.createSpy('MockViewModel ctor').
      andCallFake(function(opt_attrs, opt_options) {
        this.dataArg = opt_options.data;

        Model.apply(this, arguments);
      });
    _.inherits(MockViewModel, ViewModel);
  });

  describe('A ViewCollection', function() {

    describe('constructor', function() {

      it('should create view models for all data models', function() {
        var dataCollection = new Collection([
          {
            foo: 'bar'
          },
          {
            foo: 'shazaam'
          }
        ]);

        var viewCollection = new ViewCollection(undefined, {
          data: dataCollection,
          model: MockViewModel
        });

        expect(viewCollection.at(0).dataArg).toEqual(dataCollection.at(0));
        expect(viewCollection.at(1).dataArg).toEqual(dataCollection.at(1));

        expect(MockViewModel.callCount).toEqual(2);
        expect(viewCollection.length).toEqual(2);
      });

      describe('Event bindings', function() {

        it('should add a view model when a data model is added', function() {
          var dataCollection = new Collection();
          var addSpy = jasmine.createSpy('add');
          var viewCollection = new ViewCollection(undefined, {
            data: dataCollection,
            model: MockViewModel
          });

          viewCollection.on('add', addSpy);

          dataCollection.add({ foo: 'bar' });
          expect(viewCollection.at(0).dataArg).toEqual(dataCollection.at(0));
          expect(addSpy).toHaveBeenCalled();

          dataCollection.add({ foo: 'shazaam' });
          expect(viewCollection.at(1).dataArg).toEqual(dataCollection.at(1));
          expect(addSpy.callCount).toEqual(2);
        });

        it('should remove a view model when a data model is removed', function() {
          var dataCollection = new Collection();
          var removeSpy = new jasmine.createSpy('remove');
          var viewCollection = new ViewCollection(undefined, {
            data: dataCollection,
            model: MockViewModel
          });

          viewCollection.on('remove', removeSpy);

          dataCollection.add({ foo: 'bar' });
          dataCollection.remove(dataCollection.at(0));
          expect(viewCollection.length).toEqual(0);
          expect(removeSpy.callCount).toEqual(1);
        });


        it('should reset view models when data models are reset', function() {
          var dataCollection = new Collection();
          var resetSpy = jasmine.createSpy('reset');
          var viewCollection = new ViewCollection(undefined, {
            data: dataCollection,
            model: MockViewModel
          });

          viewCollection.on('reset', resetSpy);

          dataCollection.add([
            {
              foo: 'bar'
            },
            {
              foo: 'shazaam'
            }
          ]);

          dataCollection.reset([
            {
              hello: 'world'
            },
            {
              hello: 'universe'
            },
            {
              hello: 'kitty'
            }
          ]);

          expect(viewCollection.length).toEqual(3);
          expect(viewCollection.at(0).dataArg).toEqual(dataCollection.at(0));
          expect(viewCollection.at(1).dataArg).toEqual(dataCollection.at(1));
          expect(viewCollection.at(2).dataArg).toEqual(dataCollection.at(2));
          expect(resetSpy.callCount).toEqual(1);
        });

      });

    });

  });

});
