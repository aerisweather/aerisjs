define(['aeris/promise'], function(Promise) {
  return function getJson(url) {
    var promise = new Promise();

    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        try { var json = JSON.parse(request.responseText); }
        catch (err) { return promise.reject(err); }

        return promise.resolve(json);
      } else {
        var err = Object.assign(new Error('Request to ' + url + ' returned an HTTP error code'), {
          xhr: request
        });
        return promise.reject(err);
      }
    };

    request.onerror = promise.reject;

    request.send();

    return promise;
  };
});
