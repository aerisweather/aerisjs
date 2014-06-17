define([
  'aeris/util'
], function(_) {
  var templateString = '<div>' +
    '  <img src="{url}"' +
    '       ">' +
    '  <div style="position: absolute;' +
    '          bottom: {height - 8}px;' +
    '          right: -{width / 2}px;' +
    '          color: #fff;' +
    '          font-size: 12px;' +
    '          font-family: Arial,sans-serif;' +
    '          font-weight: bold;' +
    '          font-style: normal;' +
    '          text-decoration: none;' +
    '          text-align: center;' +
    '          width: 25px;' +
    '          line-height:1.5em;' +

                // Background image
    '           background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #a90329), color-stop(44%, #8f0222), color-stop(100%, #6d0019));' +
    '           background-image: -webkit-linear-gradient(top, #a90329 0%, #8f0222 44%, #6d0019 100%);' +
    '           background-image: -moz-linear-gradient(top, #a90329 0%, #8f0222 44%, #6d0019 100%);' +
    '           background-image: -o-linear-gradient(top, #a90329 0%, #8f0222 44%, #6d0019 100%);' +
    '           background-image: linear-gradient(top, #a90329 0%, #8f0222 44%, #6d0019 100%);' +
    '           -webkit-border-radius: 5px;' +
    '           -moz-border-radius: 5px;' +
    '           -ms-border-radius: 5px;' +
    '           -o-border-radius: 5px;' +
    '           border-radius: 5px;' +
    '           border: 1px solid rgba(0, 0, 0, 0.5);' +
    '          ">' +
    '    {count}' +
    '  </div>' +
    '</div>';

  return function clusterIconTemplate(data) {
    return _.template(templateString, data);
  };
});
