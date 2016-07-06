var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

var SERVER_MAIN_FILE = __dirname + '/server.js';
var SERVER_FILES = __dirname + '/io/**/*.js';

gulp.task('nodemon', function(cb) {
    var started = false;

    return nodemon({
        script: SERVER_MAIN_FILE,
        watch: [SERVER_MAIN_FILE, SERVER_FILES, __dirname + 'URLs.js']
    }).on('start', function() {
        //to avoid nodemon being started multiple times
        if (!started) {
            started = true;
        }
        cb();
    }).on('restart', function() {
        setTimeout(reload, 300);
    });
});

gulp.task('browserSync', gulp.series('nodemon', function(cb) {
    var config = {
        proxy: 'http://localhost:8001',
        port: 9000
    };
    if (/^win/.test(process.platform)) {
        config.browser = 'google chrome'
    } else {
        config.browser = 'chromium-browser'
    }
    return browserSync.init(config, cb);
}));

gulp.task('reload', function(done) {
    reload();
    done();
});

gulp.task('watch', function(done) {
    gulp.watch([__dirname + '/index.html'], gulp.series('reload'));
    done();
});


gulp.task('default', gulp.series('browserSync', 'watch', function(done) {
    done();
}));
