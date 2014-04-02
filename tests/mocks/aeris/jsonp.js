define(function() {
  var MockJSONP = function() {
    this.get = jasmine.createSpy('get');
  };

  MockJSONP.prototype.getRequestedUrl = function() {
    return this.getGetArgAt_(0);
  };

  MockJSONP.prototype.getRequestedData = function() {
    return this.getGetArgAt_(1);
  };

  MockJSONP.prototype.getRequestedCallback = function() {
    return this.getGetArgAt_(2);
  };

  MockJSONP.prototype.getGetArgAt_ = function(argIndex) {
    if (!this.get.callCount) {
      new Error('Unable to return argument for MockJSONP#get: ' +
        'MockJSONP#get was never called');
    }

    return this.get.mostRecentCall.args[argIndex];
  };

  MockJSONP.prototype.resolveWith = function(res) {
    var cb;

    if (this.get.callCount) {
      cb = this.getRequestedCallback();
      cb(res);
    }

    this.get.andCallFake(function(url, params, callback) {
      callback(res);
    });
  };


  return MockJSONP;
});
