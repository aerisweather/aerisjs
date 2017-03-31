define([], function() {
  return {
    fromDate: function(date) {
      // AMP time format is
      // YYYYMMDDHHmmss
      return [date.getFullYear()]
        .concat(
          [
            date.getUTCMonth() + 1,
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds()
          ].map(function(str) {
            return padLeft(str, 2);
          })
        )
        .join('');
    }
  };
});

// http://stackoverflow.com/a/5367656/830030
function padLeft(number, maxLen, padStr) {
  var padLength = maxLen - String(number).length + 1;
  padStr || (padStr = '0');

  return new Array(padLength)
      .join(padStr || '0') + number;
}
