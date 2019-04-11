// Плагины
var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		autoprefixer   = require('gulp-autoprefixer'),
		notify         = require("gulp-notify");

// Переменные среды
var projectRoot = 'dev'

// Сервер и автообновление страницы Browsersync
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: projectRoot
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

// Минификация пользовательских скриптов проекта и JS библиотек в один файл
gulp.task('js', function() {
	return gulp.src([
		projectRoot + '/libs/jquery/dist/jquery.min.js',
		projectRoot + '/js/common.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest(projectRoot + '/js'))
	.pipe(browserSync.reload({stream: true}));
});

// Компиляция Sass в main.min.css
gulp.task('sass', function() {
	return gulp.src(projectRoot + '/sass/**/*.sass')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest(projectRoot + '/css'))
	.pipe(browserSync.reload({stream: true}));
});

// Слежение за файлами проекта
gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch(projectRoot + '/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js',projectRoot + '/js/common.js'], ['js']);
	gulp.watch(projectRoot + '/*.html', browserSync.reload);
});

// Default task
gulp.task('default', ['watch']);
