// run: node ./build.js


const dir = './src/granum2024/'
const src = './src/granum2024/asset/granum2024.css'
const dist = './dist/granum2024.css'
const distMinCss = './dist/granum2024.min.css'
const distMinJs = './dist/granum2024.min.js'
const distHtml = './dist/granum2024.html'

const replace = require('replace-in-file');
const {name, version} = require('./package.json');
const csso = require('csso');
const UglifyJS = require("uglify-js"); 
const fs = require('fs') 

if (fs.existsSync(distMinCss)) fs.unlinkSync(distMinCss)
if (fs.existsSync(distMinJs)) fs.unlinkSync(distMinJs)
  
;[
'var',
'reset',
'typo',
'space',
'display',
'table',
'table-fixed',
'color',
'icon-path',
'form',
'input',
'custom-switch',
'dropzone',
'layout',
'toggle',
'slider',
'print'
].forEach(n => {
  console.log('Minify ' + n + '.css...');
  const css = fs.readFileSync(dir + 'asset/' + n + '.css', 'utf8');
  let min = csso.minify(css, {
    restructure: false,
  }).css;
  min = '/*! ' + n + '.css */\n' + min // + 'v' + version + ' */\n' + min;
  fs.writeFileSync(distMinCss, min + '\n\n', {flag: 'as'});
});


// minify js

['granum2024']
.forEach(n => {
  console.log('Minify ' + n + '.js...');
  const js = fs.readFileSync(dir + 'asset/' + n + '.js', 'utf8');
  var res = UglifyJS.minify(js, {
    compress: {
      // arrows: false,
      // comparisons: false,
      // sequences: false,
      // conditionals: false,
      // reduce_vars: false
    },
    output: {
      //preamble: '/*! ' + n + '.js v' + version + ' */',
      comments: /^!/,
    }
  });
  fs.writeFileSync(distMinJs, res.code);
  if (res.error) console.error('UglifyJS failed [' + n + '.js]: ' + res.error);
});

// copy demo html

fs.copyFileSync(dir + 'granum2024.html', distHtml)
const replace_options = {
  files: [
    distHtml,
  ],
  from: /asset\/granum2024\./g,
  to: 'granum2024.min.' // + version,
};

try {
  const results = replace.sync(replace_options);
  console.log('Replace: \n', results);
}
catch (error) {
  console.error('Replace error:', error);
}
