const dir = './src/granum2024/asset/'
const src = './src/granum2024/asset/granum2024.css'
const dist = './dist/granum2024.css'
const distMin = './dist/granum2024.min.css'

const replace = require('replace-in-file');
const {name, version} = require('./package.json');
const csso = require('csso');
const fs = require('fs') 

if (fs.existsSync(distMin)) fs.unlinkSync(distMin)
  
;[
'var',
'reset',
'typo',
'space',
'display',
'table',
'color',
'icon-path',
'form',
'input',
'custom-switch',
'dropzone',
'layout',
'toggle',
'print'
].forEach(n => {
  console.log('Minify ' + n + '.css...');
  const css = fs.readFileSync(dir + n + '.css', 'utf8');
  let min = csso.minify(css, {
    restructure: false,
  }).css;
  min = '/*! ' + n + '.css */\n' + min // + 'v' + version + ' */\n' + min;
  fs.writeFileSync(distMin, min + '\n\n', {flag: 'as'});
});
 