// const glob = require('glob');
const fs = require('fs');
// TODO: figure out postcss
const uncss = require('uncss');
const cssnano = require('cssnano');
const sass = require('node-sass');
const mkdirp = require('mkdirp');

const cssdir = 'static/css';
const scssdir = 'static/sass';
const srcs = ['mytheme'];

function basenameToScss(bn) {
  return `${scssdir}/${bn}.scss`;
}

function basenameToCss(bn) {
  return `${cssdir}/${bn}.css`;
}

function errorHandler(err, place) {
  console.error(`[${place}] ${err.message}`);
  process.exitCode = 1;
}

function makeMinified(css, file) {
  let minified;
  try {
    minified = csso.minify(css);
  } catch (e) {
    errorHandler(e, 'csso');
    return;
  }
  // write the minified css.
  fs.writeFile(basenameToCss(file), minified.css, (e) => {
    if (e) errorHandler(e, 'writeFile');
  });
}

function makeCss(file) {
  sass.render(
    {
      file: basenameToScss(file),
      outputStyle: 'expanded',
    },
    (err, result) => {
      if (err) {
        errorHandler(err, 'sass');
        return;
      }
      // now try to minify.
      makeMinified(result.css, file);
    },
  );
}

// main
mkdirp(cssdir, (err) => {
  if (err) {
    errorHandler(err, 'mkdirp');
    return;
  }
  srcs.forEach((file) => {
    makeCss(file);
  });
});
