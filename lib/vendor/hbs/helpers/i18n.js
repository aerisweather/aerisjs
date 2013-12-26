define([
  'vendor/handlebars',
  'aeris/builder/config/i18n/labels'
], function(Handlebars, labels) {
  var i18n = function(key) {
    return labels[key] || key;
  };

  Handlebars.registerHelper('i18n', i18n);

  return i18n;
});
