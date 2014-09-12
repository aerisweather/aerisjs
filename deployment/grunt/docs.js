module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('docs', [
    'compass:api-docs',
    'compass:public-docs',
    'shell:generateDocs'
  ]);

  return grunt.config.merge({
    compass: {
      'api-docs': {
        options: {
          cssDir: 'docs/assets/css',
          sassDir: 'docs/themes/api/scss',
          imagesDir: 'docs/assets/images',
          fontsDir: 'docs/assets/fonts',
          javascriptsDir: 'docs/assets/js',
          relativeAssets: true,
          importPath: 'docs/themes/public/scss',
          force: true
        }
      },
      'public-docs': {
        options: {
          cssDir: 'docs/assets/css',
          sassDir: 'docs/themes/public/scss',
          imagesDir: 'docs/assets/images',
          fontsDir: 'docs/assets/fonts',
          javascriptsDir: 'docs/assets/js',
          relativeAssets: true
        }
      }
    },

    shell: {
      // @TODO: use YUIDoc grunt tasks
      //    so we're able to configure docs build here.
      //    (eg, we could build for local testing env, or for prod)
      generateDocs: {
        command: [
          // Create out dirs
          'mkdir -p ../<%=buildDirs.docs%>/api',

          // Generate public docs (using node script / handlebars)
          'node scripts/generatepublicdocs.js ../src themes/public ../<%=buildDirs.docs%>/index.html',

          // Geneate *.md docs (using node script / handlebars)
          'node scripts/generatemarkdowndocs.js themes/markdown ./',

          // Generate api docs (using yuidoc)
          '../node_modules/.bin/yuidoc -c yuidoc.json -o ../<%=buildDirs.docs%>/api'
        ].join('&&'),
        options: {
          execOptions: {
            cwd: 'docs'
          }
        }
      }
    }
  });
};
