define([
  'aeris/model',
  'aeris/config'
], function(Model, aerisConfig) {
  var apiKeys_orig = {
    apiId: aerisConfig.get('apiId'),
    apiSecret: aerisConfig.get('apiSecret')
  };

  /**
   * @class MockConfig
   * @static
   *
   * @param opt_attrs
   * @param opt_options
   * @constructor
   */
  var MockConfig = function(opt_attrs, opt_options) {
  };

  MockConfig.stubApiKeys = function(opt_keys) {
    var keys = opt_keys || {
      apiId: MockConfig.API_ID_STUB,
      apiSecret: MockConfig.API_SECRET_STUB
    };

    aerisConfig.set(keys);
  };

  MockConfig.restore = function() {
    aerisConfig.set(apiKeys_orig);
  };

  MockConfig.API_ID_STUB = 'API_ID_STUB';
  MockConfig.API_SECRET_STUB = 'API_SECRET_STUB';

  function resetStubs() {
    MockConfig.API_ID_STUB = 'API_ID_STUB';
    MockConfig.API_SECRET_STUB = 'API_SECRET_STUB';
  }
  resetStubs();

  // Make sure our stubs don't get overwritten.
  if (beforeEach) {
    beforeEach(resetStubs);
  }


  return MockConfig;
});
