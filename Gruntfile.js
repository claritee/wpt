module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    perfbudget: {
      default: {
        options: {
          url: grunt.option('url'),
          wptInstance: grunt.option('wpt') || 'http://localhost:4000',
          connectivity: grunt.option('connectivity') || 'Native',
          location: 'Test',
          timeout: grunt.option('timeout') || "1200", 
          runs: grunt.option('runs') || 2,
          pollResults: grunt.option('runs') || 20,
          firstViewOnly: grunt.option('firstViewOnly') || true,
          repeatView: grunt.option('repeatView') || false,
          clearCerts: grunt.option('clearCerts') || true,
          ignoreSSL: grunt.option('ignoreSSL') || true,
          emulateMobile: grunt.option('emulateMobile') || false,
          budget: {
            SpeedIndex: 5000,
            render: 2000,
            visualComplete: 1000,
            TTFB: 5000,
            domElements: 5000,
            basePageSSLTime: 2000,
            bytesInDoc: 7000
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-perfbudget');

  grunt.registerTask('default', ['perfbudget']);
  grunt.registerTask('perf', ['perfbudget']);

};