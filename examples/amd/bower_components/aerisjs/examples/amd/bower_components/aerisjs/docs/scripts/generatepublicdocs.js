(function(module) {
  var fs = require('fs');
  var path = require('path');
  var _ = require('underscore');
  var Y = require('yuidocjs');
  var handlebars = require('handlebars');
  var HandlebarsRegistrar = require('./handlebarsregistrar');
  var parseYuiDocData = require('./parseyuidocdata');
  var isCalledFromCommandLine = (require.main === module);

  GLOBAL.projectConfig = require('../yuidoc.json').config;

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

    registerHandlebarsComponents(themeDir);

    var data = (new Y.YUIDoc(yuidocOptions)).run();
    var parsedData = parseYuiDocData(data);

    _.extend(parsedData, {
      projectConfig: GLOBAL.projectConfig
    });

    fs.unlinkSync(path.join(tempDir, 'data.json'));
    fs.rmdirSync(tempDir);

    GLOBAL.data = parsedData;

    return handlebars.compile(template)(parsedData);
  }

  function registerHandlebarsComponents(themeDir) {
    var handlebarsRegistrar = new HandlebarsRegistrar(handlebars);

    handlebarsRegistrar.registerHelpersInDir(path.join(themeDir, 'helpers'));
    handlebarsRegistrar.registerHelpersInDir(path.join(__dirname, 'helpers'));
    handlebarsRegistrar.registerPartialsInDir(path.join(themeDir, 'partials'));
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