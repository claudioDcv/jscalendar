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


gulp.task('watch', () => {
  refresh.listen()
  gulp.watch('**/*.js', ['scss'])
})
