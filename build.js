// npm i -g clean-css-cli
// cleancss -o dist/granum2024.min.css src/granum2024/asset/granum2024.css

const src = './src/granum2024/asset/granum2024.css'
const dist = './dist/granum2024.css'
var CleanCSS = require('clean-css');
//var input = 'a{font-weight:bold;}';
var options = { /* options */ };
var output = new CleanCSS(options)
  .minify([src])
console.log(output)
/*
var combine = require('css-combine')
var buildCSS = require('build-css')
const fs = require('fs') 

const src = './src/granum2024/asset/granum2024.css'
const dist = './dist/granum2024.css'
const distMin = './dist/granum2024.min.css'

;(async () => {
  await combine(src).pipe(
    fs.createWriteStream(dist)
  )
  
  var opts = {
      minify: true,
      paths: ['.']
  };
   
  buildCSS([
      dist,
  ], opts, function(e, css) {
      if (e) {
          throw e;
      }
   
      fs.writeFile(distMin, css, function(e) {
          // Continue building
      });
  });
})()
*/