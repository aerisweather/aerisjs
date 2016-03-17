define(['underscore'], function(_) {
  function MockXhr() {
    var xmlHttpReqOrig = XMLHttpRequest;
    var requests = []

    window.XMLHttpRequest = function() {
      var request = {
        requestMethod: null,
        requestUrl: null,
        wasSent: false,
        respondWithJson: function(json, status) {
          this.responseText = JSON.stringify(json);
          this.status = status || 200;

          this.onload();
        },

        open: function(method, url) {
          this.requestMethod = method;
          this.requestUrl = url;
        },
        send: function() {
          this.wasSent = true
        }
      };

      requests.push(request);

      return request;
    };

    return {
      restore: function() {
        window.XMLHttpRequest = xmlHttpReqOrig;
      },
      requests: requests
    };
  }

  return MockXhr;
});
