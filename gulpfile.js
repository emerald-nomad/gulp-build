const gulp = require('gulp'),
       del = require('del')
    concat = require('gulp-concat'),
    uglify = require("gulp-uglify"),
    minify = require('gulp-clean-css');
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
 webserver = require('gulp-webserver');

gulp.task('clean', () => {
    return del(["dist/*"]);
})

gulp.task('scripts', () => {
   return gulp.src(["js/circle/autogrow.js", "js/circle/circle.js"])
        .pipe(maps.init())
        .pipe(concat("all.min.js"))
        .pipe(uglify())
        .pipe(maps.write('./'))
        .pipe(gulp.dest("dist/scripts"));
});

gulp.task('styles', () => {
    return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(minify())
    .pipe(rename("all.min.css"))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('images', () => {
    return gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'))
});

gulp.task('watch', () => {
    gulp.watch(['sass/**/*.scss', 'sass/**/*.sass'], ['styles']);
    gulp.watch('js/**/*.js', ['scripts']);
});

gulp.task('build', ["clean", "scripts", "styles", "images"], () => {
    return gulp.src(['icons/**', "index.html"], { base: './' })
        .pipe(gulp.dest('dist'));
});

gulp.task("serve", function () {
    gulp.src('dist').pipe(webserver({
        livereload: {
            enable: true,
            filter: function (fileName) {
                if (fileName.match(/dist/)) {
                    return true;
                } else {
                    return false;
                }
            },
        }
    }));
    return gulp.start("watch")
});

gulp.task('default', ["build"], () => {
    gulp.start(["serve"]);
    return console.log("Webserver started at http://localhost:8000");
});