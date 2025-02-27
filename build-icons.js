// run: node ./build-icons.js

process.chdir('./src/one-path-icons/')

const dir = './'
const dist = '../../dist/'
const docs = '../../docs/'
//const distMinCss = '../../dist/one-path-icons.min.css'

const replace = require('replace-in-file')
const {name, version} = require('./package.json')
// const csso = require('csso')
var CleanCSS = require('clean-css')
const UglifyJS = require("uglify-js")
const fs = require('fs') 


// cleanup
;[dist + 'one-path-icons.min.css', dist + 'icons-decoration.min.css', docs + 'one-path-icons.min.css'].forEach(f => {
  if (fs.existsSync(f)) {
    try {fs.unlinkSync(dist + 'one-path-icons.min.css') }
    catch (e) { console.error(e) }
  }
})
  
const options = {
  inline: ['local'], // @import
}

;[
  'one-path-icons',
  'icons-decoration',
].forEach(n => {
  console.log('Minify ' + n + '.css...')
  const css = fs.readFileSync(dir + n + '.css', 'utf8')
  
  //let min = csso.minify(css, { restructure: false }).css // no support for media ranges
  const output = new CleanCSS(options).minify(css)
  console.log({
    inlinedStylesheets: output.inlinedStylesheets,
    errors: output.errors,
    warnings: output.warnings,
  })
  let min = output.styles

  //min = '/*! ' + n + '.css */\n' + min // + 'v' + version + ' */\n' + min
  //fs.writeFileSync(distMinCss, min + '\n\n', {flag: 'as'})
  const fn = n + '.min.css'
  fs.writeFileSync(dist + fn, min, {flag: 'w'})
  fs.copyFileSync(dist + fn, docs + fn)
})


// copy demo html

//fs.copyFileSync(distMinCss, docs + 'one-path-icons.min.css')
fs.copyFileSync(dir + 'one-path-icons.html', docs + 'one-path-icons.html')
const replace_options = {
  files: [
    docs + 'one-path-icons.html',
  ],
  from: [
    /one-path-icons\.css/g,
    /icons-decoration\.css/g,
  ],
  to: [
    'one-path-icons.min.css', // + version,
    'icons-decoration.min.css', // + version,
  ],
}

try {
  const results = replace.sync(replace_options)
  console.log('Replace: \n', results)
}
catch (error) {
  console.error('Replace error:', error)
}
