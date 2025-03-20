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
const path = require('path') 
const tools = require('./src/one-path-icons/icons-tools2.js')
const size = 200
const options = {
  inline: ['local'], // @import
}


// cleanup
/*
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
*/

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

// svg
console.log('Generate SVG...')
// parse one-path-icons.css,
const css = fs.readFileSync(dir + 'one-path-icons.css', 'utf8')
const icons = css.matchAll(/\.icon-([\w\-]+)\s*\{(.*?--w:(\d+);.*?path\("(.*?)"\).*?)\}/sg)
const paths = [...icons].filter(i => !i[1].match(/\d/)).map(i => [i[1], i[3], i[4]])
//console.log(paths.map(i => i[0]))
console.log('Icons:', paths.length)
// foreach icon gen & save svg
const symbols = []
paths.forEach(([name, width, path]) => {
  const svg = tools.icon.svg(width, path, '', size, size)
  symbols.push(tools.icon.symbol(width, path, 'icon-' + name))
  fs.writeFileSync(dist + 'icon-' + name + '.svg', svg, {flag: 'w'})
})
fs.writeFileSync(dist + 'icons-symbols.svg', '<svg xmlns="http://www.w3.org/2000/svg">\n' + symbols.join('\n') + '\n</svg>', {flag: 'w'})


// copy demo html

//fs.copyFileSync(distMinCss, docs + 'one-path-icons.min.css')
fs.copyFileSync(dir + 'one-path-icons.html', docs + 'one-path-icons.html')
fs.copyFileSync(dir + 'icons-tools.js', docs + 'icons-tools.js')
fs.copyFileSync(dir + 'icons-gen.js', docs + 'icons-gen.js')

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
