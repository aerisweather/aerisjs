(function(module) {
  var fs = require('fs');
  var path = require('path');
  var _ = require('underscore');
  var Y = require('yuidocjs');
  var handlebars = require('handlebars');
  var parseYuiDocData = require('./parseyuidocdata');
  var isCalledFromCommandLine = (require.main === module);

  /**
   * Generate docs by providing all YUIDoc
   * annotation data to a single template.
   *
   * Data is parsed using the parseyuidocdata script.
   *
   * Command line usage:
   *  $ node generateDocs.js lib/ themes/mytheme/ outfile.html
   *
   * Expects theme directories for:
   *  - [themedir]/partials/
   *  - [themedir]/helpers/
   *
   * Partials and helpers will be registered with handlebars.
   *
   * @param {string} libDir
   * @param {string} themeDir
   * @returns {string} Generated content
   */
  function generateDocs(libDir, themeDir) {
    var tempDir = './tmp';
    var template = fs.readFileSync(path.join(themeDir, 'layouts', 'main.handlebars'), 'utf8');
    var yuidocOptions = {
      paths: [libDir],
      outdir: tempDir
    };

    registerHelpersInDir(path.join(themeDir, 'helpers'));
    registerPartialsInDir(path.join(themeDir, 'partials'));

    var data = (new Y.YUIDoc(yuidocOptions)).run();
    var parsedData = parseYuiDocData(data);

    fs.unlinkSync(path.join(tempDir, 'data.json'));
    fs.rmdirSync(tempDir);

    GLOBAL.data = parsedData;

    return handlebars.compile(template)(parsedData);
  }

  function registerHelpersInDir(helpersDir) {
    var helperPaths = fs.readdirSync(helpersDir);

    helperPaths.forEach(function(fileName) {
      var helpers = require(path.join(helpersDir, fileName));

      if (_.isFunction(helpers)) {
        handlebars.registerHelper(path.baseName(fileName, '.js'), helpers);
      }
      else {
        _.each(helpers, function(helperFn, name) {
          handlebars.registerHelper(name, helperFn);
        });
      }
    });
  }

  function registerPartialsInDir(partialsDir) {
    var partialPaths = fs.readdirSync(partialsDir);

    partialPaths.forEach(function(fileName) {
      var html = fs.readFileSync(path.join(partialsDir, fileName), 'utf8');
      var partialName = path.basename(fileName, '.handlebars');

      handlebars.registerPartial(partialName, html);
    });
  }

  function getFileFromArg(argIndex, errMsg) {
    if (!process.argv[argIndex]) {
      console.log(errMsg);
      process.exit(1);
    }

    return path.join(process.cwd(), process.argv[argIndex]);
  }

  if (isCalledFromCommandLine) {
    var libDir = getFileFromArg(2);
    var themeDir = getFileFromArg(3);
    var outFile = getFileFromArg(4);
    var docs = generateDocs(libDir, themeDir);

    fs.writeFileSync(outFile, docs);

    console.log('Done!');
  }
  else {
    module.exports = generateDocs;
  }
}(module));