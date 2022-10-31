const { src, dest, watch, parallel, series } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const del = require("del");

function cleanDist(){
	return del('dist')
}

function syncBrowser() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}
function images() {
  return src("app/img/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/img"));
}

function scripts() {
  return src(["app/js/main.js"])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function styles() {
  return src("app/scss/style.scss")
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(concat("style.min.css"))
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 version"], grid: true }))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function watching() {
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/*.html"]).on("change", browserSync.reload);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
}

function build() {
  return src(
    [
      "app/css/style.min.css",
      "app/fonts/**/*",
      "app/js/main.min.js",
      "app/*.html",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

exports.scripts = scripts;
exports.watching = watching;
exports.styles = styles;
exports.syncBrowser = syncBrowser;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, syncBrowser, watching);

// gulp rename nu mai trebuieste deoarece concat are aceasta posibilitate
// parallel permite sa lucreze mai multe taskuri in acelasi timp
// exports.default este comanda gulp. si pentru a nu scrie fiecare task, ne-am folosit de parallel
// gulp-uglify uneori nu face fata unor sarcini mai complicate. De aceea folosim gulp-uglify-es care e in dezvoltare

// const sass = require("gulp-sass")(require("sass"));
// let gulp = require("gulp"),
//   browserSync = require("browser-sync").create(),
//   uglify = require("gulp-uglify"),
//   concat = require("gulp-concat"),
//   rename = require("gulp-rename"),
//   autoprefixer = require("gulp-autoprefixer"),
//   del = require("del");

// gulp.task("clean", async function () {
//   del.sync("dist");
// });

// gulp.task("scss", function () {
//   return gulp
//     .src("app/scss/**/*.scss")
//     .pipe(sass({ outputStyle: "compressed" }))
//     .pipe(
//       autoprefixer({
//         overrideBrowserslist: ["last 8 versions"],
//       })
//     )
//     .pipe(rename({ suffix: ".min" }))
//     .pipe(gulp.dest("app/css"))
//     .pipe(browserSync.reload({ stream: true }));
// });

// gulp.task("css", function () {
//   return gulp
//     .src(["node_modules/normalize.css/normalize.css"])
//     .pipe(concat("_libs.scss"))
//     .pipe(gulp.dest("app/scss"))
//     .pipe(browserSync.reload({ stream: true }));
// });

// gulp.task("html", function () {
//   return gulp.src("app/*.html").pipe(browserSync.reload({ stream: true }));
// });

// gulp.task("script", function () {
//   return gulp.src("app/js/*.js").pipe(browserSync.reload({ stream: true }));
// });

// gulp.task("js", function () {
//   return gulp
//     .src(["app/js/main.js"])
//     .pipe(concat("libs.min.js"))
//     .pipe(uglify())
//     .pipe(gulp.dest("app/js"))
//     .pipe(browserSync.reload({ stream: true }));
// });

// gulp.task("browser-sync", function () {
//   browserSync.init({
//     server: {
//       baseDir: "app/",
//     },
//   });
// });

// gulp.task("export", function () {
//   let buildHtml = gulp.src("app/**/*.html").pipe(gulp.dest("dist"));

//   let BuildCss = gulp.src("app/css/**/*.css").pipe(gulp.dest("dist/css"));

//   let BuildJs = gulp.src("app/js/**/*.js").pipe(gulp.dest("dist/js"));

//   let BuildFonts = gulp.src("app/fonts/**/*.*").pipe(gulp.dest("dist/fonts"));

//   let BuildImg = gulp.src("app/img/**/*.*").pipe(gulp.dest("dist/img"));
// });

// gulp.task("watch", function () {
//   gulp.watch("app/scss/**/*.scss", gulp.parallel("scss"));
//   gulp.watch("app/*.html", gulp.parallel("html"));
//   gulp.watch("app/js/*.js", gulp.parallel("script"));
// });

// gulp.task("build", gulp.series("clean", "export"));

// gulp.task(
//   "default",
//   gulp.parallel("css", "scss", "js", "browser-sync", "watch")
// );
