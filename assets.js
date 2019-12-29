// const glob = require('glob');
// const uncss = require('uncss');
const fs = require('fs');
const csso = require('csso');
const sass = require('node-sass');
const mkdirp = require('mkdirp');

const cssdir = 'out/css';
const scssdir = 'lib/simple/styles';
const srcs = ['everything', 'code'];

function basenameToScss(dir, bn) {
  return `${dir}/${bn}.scss`;
}

function basenameToCss(dir, bn) {
  return `${dir}/${bn}.css`;
}

function errorHandler(err, place) {
  console.error(`[${place}] ${err.message}`);
  process.exitCode = 1;
}

function makeMinifiedAndWrite(css, file) {
  let minified;
  try {
    minified = csso.minify(css);
  } catch (e) {
    errorHandler(e, 'csso');
    return;
  }
  // write the minified css.
  fs.writeFile(basenameToCss(cssdir, file), minified.css, (e) => {
    if (e) errorHandler(e, 'writeFile');
  });
}

function makeCss(file) {
  sass.render(
    {
      file: basenameToScss(scssdir, file),
      outputStyle: 'expanded',
    },
    (err, result) => {
      if (err) {
        errorHandler(err, 'sass');
        return;
      }
      // now try to minify.
      makeMinifiedAndWrite(result.css, file);
    },
  );
}

// main
mkdirp(cssdir, (err) => {
  if (err) {
    errorHandler(err, 'mkdirp');
    return;
  }
  srcs.map(makeCss);
});
