 module.exports = {
     entry: './public/source/js/dictionary.js',
     output: {
         path: './bin',
         filename: 'app.bundle.js',
     },
     module: {
         loaders: [{
             loader: 'jsx-loader',
         }]
     }
 }