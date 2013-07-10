require(['handlebars'], function(Handlebars) {
  /**
   * Array of month names
   *
   * @type {Array}
   * @private
   */
  var monthMap_ = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
  ];

  window.Handlebars = Handlebars;

  /**
   * Converts a timestamp or ISO string to javascript Date object
   *
   * @private
   * @param {Number|Date|string} timestampOrISO A timestamp or ISO string.
   * @return {Date}
   */
  function getDate_(timestampOrISO) {
    var date;
    switch ($.type(timestampOrISO)) {
      case 'number':
        // assume timestamp
        date = new Date(timestampOrISO * 1000);
        break;
      case 'date':
        break;
      case 'string':
        // assume ISO.
        // Could check with regex, but this is more simple for now
        date = new Date(timestampOrISO);
        break;
      default:
        throw new Error('Cannot normalize date: invalid timestampOrISO argument type');
    }
    return date;
  }


  /**
   * Returns a formatted time (eg. "3:45 PM")
   *
   * @param {Date|number|string} date Can be timestamp, {Date}, or ISO {string}.
   * @return {string} Formatted time.
   */
  Handlebars.registerHelper('formatTime', function(time) {
    var hours, minutes, ampm, date;

    if (!time) { return '-'; }

    date = getDate_(time);

    minutes = date.getMinutes();
    minutes = minutes < 10 ? minutes = '0' + minutes : minutes;

    hours = date.getHours();
    ampm = 'AM';
    if (hours >= 12) {
      hours -= 12;
      ampm = 'PM';
    }
    if (hours === 0) {
      hours = 12;
    }


    return hours + ':' + minutes + ' ' + ampm;
  });


  /**
   * Returns a formatted date (eg. "Aug 21, 2013")
   *
   * @param {Date|number|string} date Can be timestamp, {Date}, or ISO {string}.
   * @return {string} Formatted date.
   */
  Handlebars.registerHelper('formatDate', function(time) {
    var date;

    if (!time) { return '-'; }

    date = getDate_(time);

    return monthMap_[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  });


  /**
   * Return a the string with all words capitalized.
   *
   * @param {string} string
   * @return {string} Capitalized string.
   */
  Handlebars.registerHelper('capitalizeWords', function(string) {
    if (!string) { return '-'; }

    if (toString.call(string) !== '[object String]') {
      throw new Error('Invalid argument: string');
    }
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  });


  /**
   * Converts a string to all uppercase letters
   *
   * @param {string} string
   * @return {string} Uppercase string.
   */
  Handlebars.registerHelper('uppercase', function(string) {
    return string.toUpperCase();
  });
});
