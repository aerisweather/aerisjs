define([
  'aeris/util',
  'aeris/viewcollection',
  'aeris/viewmodel',
  'aeris/collection',
  'aeris/model',
  'aeris/promise'
], function(_, ViewCollection, ViewModel, Collection, Model, Promise) {
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

      it('should not remove any existing model, if no data is specified', function() {
        var viewCollection = new ViewCollection([
          new Model(),
          new Model(),
          new Model()
        ], {});

        expect(viewCollection.length).toEqual(3);
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

    describe('events proxying the dataCollection', function() {
      var dataCollection, viewCollection, promiseToSync;
      var RESPONSE_DATA_STUB = { STUB: 'RESPONSE_DATA_STUB' }, OPTIONS_STUB = { STUB: 'OPTIONS_STUB' };

      beforeEach(function() {
        dataCollection = new Collection();
        viewCollection = new ViewCollection(null, {
          data: dataCollection
        });
        promiseToSync = new Promise();
      });


      describe('\'data:request\' event', function() {

        it('should proxy the data collection\'s \'request\' event', function() {
          var onDataRequest = jasmine.createSpy('onDataRequest');
          viewCollection.on('data:request', onDataRequest);

          dataCollection.trigger('request', dataCollection, promiseToSync, OPTIONS_STUB);

          expect(onDataRequest).toHaveBeenCalledWith(viewCollection, promiseToSync);
    });

  });

      describe('\'data:sync\' event', function() {

        it('should proxy the data collection\'s \'sync\' event', function() {
          var onDataSync = jasmine.createSpy('onDataSync');
          viewCollection.on('data:sync', onDataSync);

          dataCollection.trigger('sync', dataCollection, RESPONSE_DATA_STUB, OPTIONS_STUB);

          expect(onDataSync).toHaveBeenCalledWith(viewCollection, RESPONSE_DATA_STUB);
        });

      });

    });

  });

});
