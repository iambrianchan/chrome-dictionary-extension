// Gruntfile.js
module.exports = function(grunt) {

  grunt.initConfig({

    // configure webpack
    webpack: {
      dist: {
       entry: './public/src/js/dictionary.js',
       output: {
           path: './bin',
           filename: 'app.bundle.js',
       },
       module: {
          loaders: [

              {
                  test: /\.js$/, 
                  exclude: /node_modules/,
                  loader: "babel-loader"
              },
              {
                  test: /\.jsx$/, 
                  exclude: /node_modules/,
                  loader: "babel-loader"
              }
          ]
       }
      }
    }
  });

  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['webpack:dist']); 

};