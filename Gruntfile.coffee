module.exports = (grunt) ->
  grunt.initConfig

    cssmin:
      target:
        src: ['scr/css/cobi-style.css', 'scr/css/style.css'],
        dest: 'dist/style.min.css'

    browserify:
      all:
        src: 'scr/scripts/main.ts'
        dest: 'dev/main.js'
        options:
          browserifyOptions:
            debug: true
            plugin: ['tsify']

    exorcise:
      dist:
        files:
          'dist/main.min.js.map': 'dev/main.js'
        options:
          bundleDest: 'dist/main.min.js'

    uglify:
      withMaps:
        files:
          'dist/main.min.js': 'dist/main.min.js'
        options:
          sourceMap: true
          sourceMapIn: 'dist/main.min.js.map'
          sourceMapName: 'dist/main.min.js.map'
      noMaps:
        files:
          'dist/scripts/main.min.js': 'dev/scripts/main.js';

  grunt.loadNpmTasks 'grunt-browserify';
  grunt.loadNpmTasks 'grunt-exorcise';
  grunt.loadNpmTasks 'grunt-contrib-uglify';
  grunt.loadNpmTasks 'grunt-contrib-cssmin';

  grunt.registerTask 'dev', ['browserify'];
  grunt.registerTask 'dist', ['browserify', 'uglify:noMaps'];
  grunt.registerTask 'dist-with-maps', ['browserify', 'exorcise', 'uglify:withMaps'];
  grunt.registerTask 'build', ['cssmin','browserify', 'exorcise', 'uglify:withMaps'];
