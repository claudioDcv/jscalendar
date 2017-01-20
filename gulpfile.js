// // gulpfile.js
// var gulp = require('gulp');
// var server = require('gulp-express');
//
// gulp.task('server', function () {
//     // Start the server at the beginning of the task
//     server.run(['app.js']);
//
//     // Restart the server when file changes
//     gulp.watch(['public/*.html'], server.notify);
//     //gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
//     //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]);
//     //Event object won't pass down to gulp.watch's callback if there's more than one of them.
//     //So the correct way to use server.notify is as following:
//     //gulp.watch(['{.tmp,app}/styles/**/*.css'], function(event){
//       //  gulp.run('styles:css');
//         //server.notify(event);
//         //pipe support is added for server.notify since v0.1.5,
//         //see https://github.com/gimm/gulp-express#servernotifyevent
//     //});
//
//     //gulp.watch(['public/month.js'], ['jshint']);
//     gulp.watch(['public/*.*'], server.notify);
//     gulp.watch(['app.js'], [server.run]);
// });



const gulp = require('gulp'),
      sass = require('gulp-sass'),
      refresh = require('gulp-refresh')
var prettify = require('gulp-jsbeautifier');
const jsValidate = require('gulp-jsvalidate');
const babel = require('gulp-babel');
var rename = require("gulp-rename");
const eslint = require('gulp-eslint');


      var opts = {} ;
      opts.port = 3000;
      opts.host = 'localhost';


gulp.task('scss', () => {
  gulp
    //.src('src/*.scss')
    //.pipe(sass().on('error', sass.logError)))
    //.pipe(gulp.dest('dist'))

    .pipe(refresh(opts));

})



gulp.task('_1', () =>
  gulp.src(['./public/DiaES6.js'])

    .pipe(babel({
              presets: ['es2015']
          }))
    .pipe(prettify())
    .pipe(jsValidate())
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
    .pipe(rename("Dia.js"))
    .pipe(gulp.dest('./public/'))
);

// gulp.task('_2', () =>
//   gulp.src(['./public/EventoEventoConVacioES6.js'])
//     .pipe(babel({
//               presets: ['es2015']
//           }))
//     .pipe(prettify())
//     .pipe(jsValidate())
//     .pipe(rename("EventoEventoConVacio.js"))
//     .pipe(gulp.dest('./public/'))
// );



gulp.task('_w', () => {
  //refresh.listen()
  gulp.watch('./public/DiaES6.js', ['_1'])
})
