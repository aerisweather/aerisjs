require(['../lib/config'], function() {
  require(['domReady!'], function() {
    require.config({
      baseUrl: '/../lib'
    });
    initialize();
  });
});
