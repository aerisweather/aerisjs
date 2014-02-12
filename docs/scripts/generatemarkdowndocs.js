(function(module) {
  var fs = require('fs');
  var path = require('path');
  var handlebars = require('handlebars');
  var projectConfig = require('../yuidoc.json').config;
  var isCalledFromCommandLine = (require.main === module);

  function generateMarkdownDocs(themeDir, outDir) {
    var docsDir = path.join(themeDir, 'views');
    var docFiles = fs.readdirSync(docsDir);


    docFiles.forEach(function(docFile) {
      var output = processDocTemplate(path.join(docsDir, docFile));
      var outPath = path.join(outDir, docFile);

      fs.writeFileSync(outPath, output);
    }, this);
  }

  function processDocTemplate(docPath) {
    var template = fs.readFileSync(docPath, 'utf8');

    return handlebars.compile(template)(projectConfig);
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
  }

  module.exports = generateMarkdownDocs;
}(module));