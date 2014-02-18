define([
  'aeris/util',
  'mocks/aeris/directions/promises/promisetofetchdirections'
], function(_, MockPromiseToFetchDirections) {
  var MockPromiseToFetchGoogleDirections = function() {
    var stubbedMethods = [
      'settleUsingResponse'
    ];

    MockPromiseToFetchDirections.apply(this, arguments);

    _.extend(this, jasmine.createSpyObj('mockPromiseToFetchGoogleDirections', stubbedMethods));
  };
  _.inherits(MockPromiseToFetchGoogleDirections, MockPromiseToFetchDirections);


  MockPromiseToFetchGoogleDirections.prototype.shouldHaveSettledWithResponse = function(expectedResponse) {
    expect(this.getSettleResponseArg()).toEqual(expectedResponse);
  };

  MockPromiseToFetchGoogleDirections.prototype.shouldHaveSettledWithStatus = function(expectedStatus) {
    expect(this.getSettleStatusArg()).toEqual(expectedStatus);
  };


  MockPromiseToFetchGoogleDirections.prototype.getSettleResponseArg = function() {
    return this.getSettleArgs()[0];
  };


  MockPromiseToFetchGoogleDirections.prototype.getSettleStatusArg = function() {
    return this.getSettleArgs()[1];
  };


  MockPromiseToFetchGoogleDirections.prototype.getSettleArgs = function() {
    return this.settleUsingResponse.mostRecentCall.args;
  };

  return MockPromiseToFetchGoogleDirections;
});
