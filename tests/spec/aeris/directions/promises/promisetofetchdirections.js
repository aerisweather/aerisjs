define([
  'aeris/util',
  'aeris/directions/promises/promisetofetchdirections',
  'aeris/directions/results/directionsresults',
  'aeris/directions/results/directionsresultsstatus'
], function(_, PromiseToFetchDirections, DirectionsResults, DirectionsResultsStatus) {

  describe('A PromiseToFetchDirections', function() {
    var STATUS_STUB;
    var promise;
    var PATH_STUB, EMPTY_PATH_STUB;
    var DISTANCE_STUB;
    var API_CODE_STUB;
    var STATUS_MESSAGE_STUB;

    beforeEach(function() {
      promise = new PromiseToFetchDirections();

      PATH_STUB = [[12, 34], [56, 78], [90, 12]];
      EMPTY_PATH_STUB = [];
      DISTANCE_STUB = 1234.56;

      API_CODE_STUB = 'API_CODE_STUB';

      STATUS_MESSAGE_STUB = 'Stub status message.';
      STATUS_STUB = {
        code: DirectionsResultsStatus.OK,
        apiCode: API_CODE_STUB,
        message: STATUS_MESSAGE_STUB
      };

      spyOn(promise, 'resolve');
      spyOn(promise, 'reject');
    });


    describe('resolveWithPathAndDistance', function() {

      it('should resolve with a DirectionsResults object', function() {
        promise.resolve.andCallFake(function(res) {
          expect(res).toBeInstanceOf(DirectionsResults);
        });

        promise.resolveWithPathAndDistance(PATH_STUB, DISTANCE_STUB, API_CODE_STUB);

        expect(promise.resolve).toHaveBeenCalled();
      });

      it('should resolve with successful directions results', function() {
        promise.resolve.andCallFake(function(res) {
          expect(res.path).toEqual(PATH_STUB);
          expect(res.distance).toEqual(DISTANCE_STUB);

          expect(res.status.code).toEqual(DirectionsResultsStatus.OK);
          expect(res.status.apiCode).toEqual(API_CODE_STUB);
          expect(_.isString(res.status.message)).toEqual(true);
        });

        promise.resolveWithPathAndDistance(PATH_STUB, DISTANCE_STUB, API_CODE_STUB);
      });

    });

    describe('rejectBecause...', function() {
      beforeEach(function() {
        spyOn(promise, 'rejectWithStatus');
      });

      function getStatusArg(prop) {
        return promise.rejectWithStatus.mostRecentCall.args[0][prop];
      }

      function shouldHaveRejectedWithStatusProp(prop, value) {
        expect(promise.rejectWithStatus).toHaveBeenCalled();
        expect(getStatusArg(prop)).toEqual(value);
      }

      function shouldHaveRejectedWithStatusMessage() {
        var statusMessage = getStatusArg('message');

        expect(_.isString(statusMessage)).toEqual(true);
      }


      describe('rejectBecauseNoResults', function() {

        it('should reject with a NO_RESULTS code', function() {
          promise.rejectBecauseNoResults(API_CODE_STUB);

          shouldHaveRejectedWithStatusProp('code', DirectionsResultsStatus.NO_RESULTS);
        });

        it('should reject with the provided api code', function() {
          promise.rejectBecauseNoResults(API_CODE_STUB);

          shouldHaveRejectedWithStatusProp('apiCode', API_CODE_STUB);
        });

        it('should reject with a message', function() {
          promise.rejectBecauseNoResults(API_CODE_STUB);

          shouldHaveRejectedWithStatusMessage();
        });

      });


      describe('rejectBecauseApiError', function() {

        it('should reject with an API_ERROR code', function() {
          promise.rejectBecauseApiError(API_CODE_STUB);

          shouldHaveRejectedWithStatusProp('code', DirectionsResultsStatus.API_ERROR);
        });

        it('should reject with the provided api code', function() {
          promise.rejectBecauseApiError(API_CODE_STUB);

          shouldHaveRejectedWithStatusProp('apiCode', API_CODE_STUB);
        });

        it('should reject with a message', function() {
          promise.rejectBecauseApiError(API_CODE_STUB);

          shouldHaveRejectedWithStatusMessage();
        });

      });


      describe('rejectUsingErrorObject', function() {
        var STUB_ERROR_MESSAGE;
        var STUB_ERROR;

        beforeEach(function() {
          STUB_ERROR_MESSAGE = 'Stub error message.';
          STUB_ERROR = {
            message: STUB_ERROR_MESSAGE
          };
        });


        it('should reject with the API_ERROR code', function() {
          promise.rejectUsingErrorObject(STUB_ERROR);

          shouldHaveRejectedWithStatusProp('code', DirectionsResultsStatus.API_ERROR);
        });

        it('should reject without an apiCode', function() {
          promise.rejectUsingErrorObject(STUB_ERROR);

          expect(getStatusArg('apiCode')).toBeUndefined();
        });

        it('should reject with the error object\'s message', function() {
          promise.rejectUsingErrorObject(STUB_ERROR);

          shouldHaveRejectedWithStatusProp('message', STUB_ERROR_MESSAGE);
        });

      });

    });


    describe('rejectWithStatus', function() {

      function getRejectedResults() {
        return promise.reject.mostRecentCall.args[0];
      }

      function shouldHaveRejectedWithResultsProp(prop, expectedValue) {
        var actualValue = getRejectedResults()[prop];

        expect(actualValue).toEqual(expectedValue);
      }

      it('should reject with a DirectionsResults object', function() {
        promise.rejectWithStatus(STATUS_STUB);

        expect(getRejectedResults()).toBeInstanceOf(DirectionsResults);
      });

      it('should reject with an empty path', function() {
        promise.rejectWithStatus(STATUS_STUB);

        shouldHaveRejectedWithResultsProp('path', []);
      });

      it('should reject with a distance of null', function() {
        promise.rejectWithStatus(STATUS_STUB);

        shouldHaveRejectedWithResultsProp('distance', null);
      });

      it('should reject with the provided status', function() {
        promise.rejectWithStatus(STATUS_STUB);

        shouldHaveRejectedWithResultsProp('status', STATUS_STUB);
      });

    });

  });

});
