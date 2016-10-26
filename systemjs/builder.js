var path = require('path');
var Builder = require('systemjs-builder');
var builder = new Builder({ baseURL: '.' });
var transpileReact = require('babel-plugin-transform-react-jsx');

builder
  .config({
    map: {
      'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
      'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-node.js',
      'react': 'node_modules/react/dist/react.js',
      'react-dom': 'node_modules/react-dom/dist/react-dom.js',
      'babel-plugin-transform-react-jsx': 'node_modules/babel-plugin-transform-react-jsx/lib/index.js'
    },
    meta: {
      '*.js': {
        babelOptions: {
          es2015: false,
          plugins: [transpileReact]
        }
      },
      'react': {
        build: false
      }
    },
    transpiler: 'plugin-babel'
  });

builder
  .bundle('./components/ListComponent.js', './dist/list@1.js')
  .then(function() {
    console.log('Build complete');
  })
  .catch(function(err) {
    console.log('Build error');
    console.log(err);
  });
