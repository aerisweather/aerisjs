define(function() {
  var MockJSONP = function() {
    this.get = jasmine.createSpy('get');
  }

  MockJSONP.prototype.getRequestedUrl = function() {
    return this.get.mostRecentCall.args[0];
  };

  MockJSONP.prototype.getRequestedData = function() {
    return this.get.mostRecentCall.args[1];
  };

  MockJSONP.prototype.getRequestedCallback = function() {
    return this.get.mostRecentCall.args[2];
  };

  MockJSONP.prototype.resolveWith = function(res) {
    var cb;

    if (this.get.callCount) {
      cb = this.getRequestedCallback()
      cb(res);
    }

    this.get.andCallFake(function(url, params, callback) {
      callback(res);
    });
  };


  return MockJSONP;
});
