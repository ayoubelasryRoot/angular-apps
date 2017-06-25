var gulp = require('gulp');
var rename = require('gulp-rename');
const builtDir = "out/";
const appSrcBase = "app/";
const assetsDir = "assets/"
gulp.task('app-assets', function(){
    var y = gulp.src([appSrcBase + '**/*.css', appSrcBase + "**/*.html"]);
    return y.pipe(gulp.dest(builtDir));
});

gulp.task('dir-assets', function(){
    var x = gulp.src([assetsDir + "**/*"])
    return x.pipe(gulp.dest(builtDir + assetsDir));
});

gulp.task('assets', ['app-assets', 'dir-assets']);

gulp.task('postInstall',['threejs','collada']);

gulp.task('threejs', function() {
    gulp.src('./postInstall/index.d')
    .pipe(rename('index.d.ts'))
    .pipe(gulp.dest('node_modules/@types/three/'))
});

gulp.task('collada', function() {
    gulp.src('./postInstall/three-colladaLoader.d')
    .pipe(rename('three-colladaLoader.d.ts'))
    .pipe(gulp.dest('node_modules/@types/three/'))
});