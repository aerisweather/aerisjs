
var fs = require('fs'),
  pairs = {
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&apos;',
    '<': '&lt;',
    '>': '&gt;'
};

function encode(s) {
  for (var r in pairs) {
    if (typeof(s) !== 'undefined') {
      s = s.replace(new RegExp(r, 'g'), pairs[r]);
    }
  }
  return s || '';
}

exports.reportGJSLint = function(err, result, options) {
  var out = [];
  out.push('<?xml version=\"1.0\" encoding=\"utf-8\"?>');
  out.push('<jslint>');

  if (err && err.code === 2) {
    err.info.fails.forEach(function(fail) {
      var filename = fail.file;
      out.push('\t<file name=\"' + filename + '\">');
      fail.errors.forEach(function(error) {
        out.push('\t\t<issue line=\"' + error.line +
          '\" reason=\"' + encode(error.description) +
          '\" severity=\"' + error.code +
          '\" />'
        );
      });
      out.push('\t</file>');
    });
  }

  out.push('</jslint>', '\n');

  out = out.join('\n');

  if (options.dest) {
    fs.writeFileSync(options.dest, out, 'utf-8', function(err) {
      if (err) {
        console.log(err);
      } else {
        console.info('File written in ' + options.dest);
      }
    });
  } else {
    process.stdout.write(out);
  }
};
