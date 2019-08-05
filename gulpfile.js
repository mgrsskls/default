const babel = require("gulp-babel");
const cssnano = require("cssnano");
const del = require("del");
const eslint = require("gulp-eslint");
const extReplace = require("gulp-ext-replace");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const postcss = require("gulp-postcss");
const postcssImport = require("postcss-import");
const postcssPresetEnv = require("postcss-preset-env");
const rollup = require("rollup");
const stylelint = require("gulp-stylelint");
const terser = require("rollup-plugin-terser");
const twig = require("gulp-twig");
const webp = require("imagemin-webp");

const srcFolder = "./src/";
const buildFolder = "./build/";
const folders = {
  src: {
    components: "./src/assets/components",
    css: "./src/assets/css",
    images: "./src/assets/images",
    js: "./src/assets/js",
    layouts: "./src/layouts"
  },
  build: {
    css: `${buildFolder}/css`,
    images: `${buildFolder}/images`,
    js: `${buildFolder}/js`
  }
};

gulp.task("lint:js", () =>
  gulp
    .src([`${folders.src.js}/**/*.js`, `${folders.src.components}/**/*.js`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task("lint:css", () => {
  return gulp
    .src([`${folders.src.css}/**/*.css`, `${folders.src.components}/**/*.css`])
    .pipe(
      stylelint({
        reporters: [{ formatter: "string", console: true }]
      })
    );
});

gulp.task("watch:lint:js", () => {
  gulp.watch(
    [`${folders.src.js}/**/*.js`, `${folders.src.components}/**/*.js`],
    gulp.parallel("lint:js")
  );
});

gulp.task("watch:lint:css", () => {
  gulp.watch(
    [`${folders.src.css}/**/*.css`, `${folders.src.components}/**/*.css`],
    gulp.parallel("lint:css")
  );
});

gulp.task("build:js", () => {
  return rollup
    .rollup({
      input: `${folders.src.js}/index.js`,
      plugins: [babel(), terser.terser()]
    })
    .then(bundle => {
      return bundle.write({
        file: `${folders.build.js}/index.js`,
        format: "iife",
        sourcemap: true
      });
    });
});

gulp.task("build:css", () =>
  gulp
    .src(`${folders.src.css}/index.css`, { sourcemaps: true })
    .pipe(postcss([postcssImport, postcssPresetEnv, cssnano]))
    .pipe(gulp.dest(folders.build.css, { sourcemaps: "." }))
);

gulp.task("build:images", () =>
  gulp
    .src(`${folders.src.images}/**/*.{jpg,png}`)
    .pipe(gulp.dest(folders.build.images))
);

gulp.task("build:webp", () =>
  gulp
    .src(`${folders.src.images}/**/*.{jpg,png}`)
    .pipe(
      imagemin([
        webp({
          quality: 75
        })
      ])
    )
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest(folders.build.images))
);

gulp.task("build:html", () =>
  gulp
    .src(`${folders.src.layouts}/index.twig`)
    .pipe(
      twig({
        data: require(`${srcFolder}/data.json`)
      })
    )
    .pipe(gulp.dest(buildFolder))
);

gulp.task("clean", () => {
  return del([`${buildFolder}**/*`]);
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.parallel(
      "build:js",
      "build:css",
      "build:images",
      "build:webp",
      "build:html"
    )
  )
);
gulp.task(
  "default",
  gulp.parallel("lint:js", "lint:css", "watch:lint:js", "watch:lint:css")
);
