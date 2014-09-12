module.exports = function(grunt) {
  var version = grunt.option('aerisVersion') || '<%=pkg.version %>';

  grunt.registerTask('version', [
    'replace:version',
    'replace:aeris.VERSION'
  ]);

  return {
    version: {
      src: [
        'package.json',
        'bower.json',
        'docs/yuidoc.json'
      ],
      overwrite: true,
      replacements: [
        {
          from: /("version":\s*)"(.*?)"/gi,
          to: '$1"' + version + '"'
        }
      ]
    },
    'aeris.VERSION': {
      src: ['deployment/scripts/templates/start.js.frag.hbs'],
      overwrite: true,
      replacements: [
        {
          from: /(aeris\.VERSION\s=\s)'(.*?)'/g,
          to: '$1\'' + version + '\''
        }
      ]
    }
  };
};
