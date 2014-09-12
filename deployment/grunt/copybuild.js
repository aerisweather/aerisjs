module.exports = function(grunt) {
  grunt.registerTask('copyBuild', [
    'shell:copyAssets',
    'shell:copyAerisJs',
    'shell:copyLibToVersionDir',
    'shell:copyDocsToVersionDir'
  ]);

  grunt.config.merge({
    shell: {
      copyAerisJs: {
        command: [
          'cp <%=buildDirs.lib %>/aeris-leaflet-plus.js <%=buildDirs.lib %>/aeris.js',
          'cp <%=buildDirs.lib %>/aeris-leaflet-plus.min.js <%=buildDirs.lib %>/aeris.min.js'
        ].join('&&')
      },

      copyAssets: {
        command: 'cp -r assets <%=buildDirs.lib %>'
      },

      copyLibToVersionDir: {
        command: [
          'mkdir <%=buildDirs.lib %>/<%=pkg.version%>',
          'cp <%=buildDirs.lib %>/*.js <%=buildDirs.lib %>/<%=pkg.version%>'
        ].join('&&')
      },

      copyDocsToVersionDir: {
        command: [
          'cp -r <%=buildDirs.docs %>/ build/docs-tmp',
          'mv build/docs-tmp <%=buildDirs.docs %>/<%=pkg.version%>'
        ].join('&&')
      }
    }
  });
};
