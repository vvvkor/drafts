// run: node ./build-icons.js
console.log('')
console.log('# Build Icons')
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
const tools = require('./src/one-path-icons/icons-tools.js')
const size = 200
const options = {
  inline: ['local'], // @import
}

// cleanup

;[dist + 'svg/', docs + 'svg/'].forEach(d => {
  console.log('Clear ' + d + ' ...')
  //fs.readdirSync(d).forEach(n => fs.unlinkSync(d + n))
  fs.rmSync(d, {recursive: true, force: true})
}) 

;[
  dist + 'one-path-icons.min.css',
  dist + 'one-path-icons.bg.css',
  dist + 'one-path-icons.clip.css',
  dist + 'icons-decoration.min.css',
  docs + 'one-path-icons.min.css',
  docs + 'one-path-icons.bg.css',
  docs + 'one-path-icons.clip.css',
  docs + 'icons-decoration.min.css',
  docs + 'icons-tools.js',
  docs + 'icons-gen.js',
  docs + 'one-path-icons.html',
].forEach(f => {
  console.log('Remove ' + f + ' ...')
  if (fs.existsSync(f)) fs.unlinkSync(f)
})

// create subdirs

if (!fs.existsSync(dist + 'svg/')) fs.mkdirSync(dist + 'svg/')
if (!fs.existsSync(docs + 'svg/')) fs.mkdirSync(docs + 'svg/')
 

// prepare css

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
})

// generate svg & symbols & css & lists

console.log('Generate SVG in dist...')
// parse one-path-icons.css,
const css = fs.readFileSync(dir + 'one-path-icons.css', 'utf8')
const icons = css.matchAll(/\.icon-([\w\-]+)\s*\{(.*?--w:(\d+);.*?path\("(.*?)"\).*?)\}/sg)
const paths = [...icons].filter(i => !i[1].match(/\d/)).map(i => [i[1], i[3], i[4]]).sort((a, b) => a[0] < b[0] ? -1 : 1)
//console.log(paths.map(i => i[0]).sort())
console.log('Icons:', paths.length)
// foreach icon gen & save svg
const symbols = []
const vars = []
const clips = []
paths.forEach(([name, width, path]) => {
  const svg = tools.icon.svg(width, path, '', size, size)
  symbols.push(tools.icon.symbol(width, path, /*'icon-' + */name))
  vars.push('.ico-' + name +' {' + tools.icon.var(width, path) + '}')
  fs.writeFileSync(dist + 'svg/icon-' + name + '.svg', svg, {flag: 'w'})
})
fs.writeFileSync(dist + 'svg/icons-symbols.svg', '<svg xmlns="http://www.w3.org/2000/svg">\n' + symbols.join('\n') + '\n</svg>', {flag: 'w'})
fs.writeFileSync(dist + 'one-path-icons.var.css', vars.join('\n'), {flag: 'w'})
fs.writeFileSync(dist + 'icons-names.js', 'export default [' + paths.map(([name]) => `'${name}'`).join(', ') + ']', {flag: 'w'})
fs.writeFileSync(dist + 'icons-paths.js', 'export default {\n' + paths.map(([name, width, path]) => `  ${name}: [${width}, '${path}']`).join(',\n') + '\n}', {flag: 'w'})

// copy to docs

console.log('Copy to docs...')
fs.readdirSync(dist + 'svg/').forEach(n => fs.copyFileSync(dist + 'svg/' + n, docs + 'svg/' + n))
;[
  dist + 'one-path-icons.min.css',
  dist + 'one-path-icons.var.css',
  dist + 'icons-decoration.min.css',
  dir + 'one-path-icons.html',
  dir + 'icons-tools.js',
  dir + 'icons-gen.js',
  
].forEach(f => fs.copyFileSync(f, docs + path.basename(f)))

// replace content

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
  console.log('Replace content: \n', results)
}
catch (error) {
  console.error('Replace error:', error)
}
