(function(module) {
  var fs = require('fs');
  var path = require('path');
  var handlebars = require('handlebars');
  var HandlebarsRegistrar = require('./handlebarsregistrar');
  var isCalledFromCommandLine = (require.main === module);

  GLOBAL.projectConfig = require('../yuidoc.json').config;

  /**
   * Example command line usage:
   *  $ node generatemarkdowndocs.js /myThemeDir /myOutDir
   *
   * Expects theme directories for:
   *  - [themedir]/views/   << contains markdown templates
   *
   * @param {string} themeDir
   * @param outDir
   */
  function generateMarkdownDocs(themeDir, outDir) {
    var docsDir = path.join(themeDir, 'views');
    var docFiles = fs.readdirSync(docsDir);

    registerHandlebarsComponents(themeDir);

    docFiles.forEach(function(docFile) {
      var output = processDocTemplate(path.join(docsDir, docFile));
      var outPath = path.join(outDir, path.basename(docFile, '.handlebars'));

      console.log('Writing to ' + outPath + '...');
      fs.writeFileSync(outPath, output);
    }, this);
  }

  function processDocTemplate(docPath) {
    var template = fs.readFileSync(docPath, 'utf8');

    return handlebars.compile(template)(getTemplateContext());
  }

  function getTemplateContext() {
    return {
      project: GLOBAL.projectConfig
    };
  }

  function registerHandlebarsComponents(themeDir) {
    var handlebarsRegistrar = new HandlebarsRegistrar(handlebars);

    handlebarsRegistrar.registerHelpersInDir(path.join(__dirname, 'helpers'));
    handlebarsRegistrar.registerHelpersInDir(path.join(themeDir, 'helpers'));
  }



  function getFileFromArg(argIndex, errMsg) {
    if (!process.argv[argIndex]) {
      console.log(errMsg);
      process.exit(1);
    }

    return path.join(process.cwd(), process.argv[argIndex]);
  }

  if (isCalledFromCommandLine) {
    var themeDir = getFileFromArg(2);
    var outDir = getFileFromArg(3);

    generateMarkdownDocs(themeDir, outDir);

    console.log('Done!')
  }

  module.exports = generateMarkdownDocs;
}(module));