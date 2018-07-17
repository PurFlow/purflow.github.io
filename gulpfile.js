var gulp = require('gulp');
var browserSync = require('browser-sync');
var cp = require('child_process');
var rollup = require('gulp-rollup');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};
var browserSyncRoutes = {
    /**
     * Comment this if you don't use a site.baseurl in _config.yml
     * or change '/johnyplate' to your site.baseurl.
     */
    // '/baseurl': '_site'
}

gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn(jekyll, ['build'], {
            stdio: 'inherit'
        })
        .on('close', done);
});

gulp.task('bundle', function () {
    gulp.src('./_scripts/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(rollup({
            input: './_scripts/main.js',
            format: 'iife'
        }))
        .on('error', console.log)
        .pipe(babel({
            "presets": ["es2015", "minify"]
        }))
        .pipe(gulp.dest('./js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_site/js'));
    browserSync.reload();
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('browser-sync', ['jekyll-build'], function () {
    browserSync({
        server: {
            baseDir: '_site',
            routes: browserSyncRoutes
        }
    });
});

gulp.task('watch', function () {
    gulp.watch([
        './*',
        '_categorias/**/*',
        '_posts/**/*',
        '_layouts/**/*',
        '_includes/**/*',
        '_sass/**/*',
        'css/**/*'
    ], ['jekyll-rebuild']);
    gulp.watch([
        '_scripts/**/*'
    ], ['bundle']);
});

gulp.task('default', ['browser-sync', 'watch']);