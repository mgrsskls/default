const gulp = require("gulp");
const eslint = require("gulp-eslint");
const stylelint = require("gulp-stylelint");
const babel = require("gulp-babel");
const postcss = require("gulp-postcss");

const jsFiles = ["js/*.js"];
const cssFiles = ["css/index.css"];
const jsDist = "build/js/";
const cssDist = "build/css/";

gulp.task("lint:js", () =>
  gulp
    .src(jsFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task("lint:css", () => {
  return gulp.src(cssFiles).pipe(
    stylelint({
      reporters: [{ formatter: "string", console: true }]
    })
  );
});

gulp.task("watch:lint:js", () => {
  gulp.watch(jsFiles, gulp.parallel("lint:js"));
});

gulp.task("watch:lint:css", () => {
  gulp.watch(cssFiles, gulp.parallel("lint:css"));
});

gulp.task("build:js", () =>
  gulp
    .src(jsFiles, { sourceMaps: true })
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(gulp.dest(jsDist, { sourcemaps: "." }))
);

gulp.task("build:css", () =>
  gulp
    .src(cssFiles, { sourcemaps: true })
    .pipe(postcss())
    .pipe(gulp.dest(cssDist, { sourcemaps: "." }))
);

gulp.task("build", gulp.parallel("build:js", "build:css"));
gulp.task(
  "default",
  gulp.parallel("watch:lint:js", "watch:lint:css", "build:js", "build:css")
);
