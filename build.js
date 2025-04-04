// run: node ./build.js

const dir = './src/granum2024/'
const src = './src/granum2024/asset/granum2024.css'
const dist = './dist/'
const docs = './docs/'
const distMinCss = './dist/granum2024.min.css'
const distMinJs = './dist/granum2024.min.js'

const replace = require('replace-in-file')
const {name, version} = require('./package.json')
// const csso = require('csso')
var CleanCSS = require('clean-css')
const UglifyJS = require("uglify-js")
const fs = require('fs') 


;[dist, docs].forEach(d => {
  console.log('Clear ' + d + '...')
  fs.readdirSync(d).forEach(n => {
    if (fs.existsSync(d + n)) {
      try {
        fs.unlinkSync(d + n)
      } catch (error) {
        console.error(error)
      }
    }
  })
}) 
  
const options = { /* options */ }
;[
'var',
'reset',
'typo',
'space',
'display',
'table',
'table-fixed',
'color',
//'icon-path',
'icon-vars',
'icon-animate',
'form',
'input',
'custom-switch',
'dropzone',
'layout',
'toggle',
'slider',
'print'
].forEach(n => {
  console.log('Minify ' + n + '.css...')
  const css = fs.readFileSync(dir + 'asset/' + n + '.css', 'utf8')
  
  //let min = csso.minify(css, { restructure: false }).css // no support for media ranges
  let min = (new CleanCSS(options).minify(css)).styles

  min = '/*! ' + n + '.css */\n' + min // + 'v' + version + ' */\n' + min
  fs.writeFileSync(distMinCss, min + '\n\n', {flag: 'as'})
})


// minify js

;['granum2024']
.forEach(n => {
  console.log('Minify ' + n + '.js...')
  const js = fs.readFileSync(dir + 'asset/' + n + '.js', 'utf8')
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
  })
  fs.writeFileSync(distMinJs, res.code)
  if (res.error) console.error('UglifyJS failed [' + n + '.js]: ' + res.error)
})

// copy demo html

fs.copyFileSync(dir + 'asset/customize.js', docs + 'customize.js')
fs.copyFileSync(dir + 'asset/icon-paths.js', docs + 'icon-paths.js')
fs.copyFileSync(distMinCss, docs + 'granum2024.min.css')
fs.copyFileSync(distMinJs, docs + 'granum2024.min.js')
fs.copyFileSync(dir + 'granum2024.html', docs + 'index.html')
const replace_options = {
  files: [
    docs + 'index.html',
  ],
  from: [
    /asset\/granum2024\./g,
    /asset\/customize\./g,
    /asset\/icon-paths\./g,
  ],
  to: [
    'granum2024.min.', // + version,
    'customize.',
    'icon-paths.',
  ],
}

try {
  const results = replace.sync(replace_options)
  console.log('Replace: \n', results)
}
catch (error) {
  console.error('Replace error:', error)
}

require('./build-icons.js')