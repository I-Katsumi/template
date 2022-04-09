/*
src 参照元を指定
dest 出力さきを指定
watch ファイル監視
series(直列処理)とparallel(並列処理)
*/
const { src, dest, watch, series, parallel } = require('gulp');

// プラグインを呼び出し
const sass = require('gulp-dart-sass');
const plumber = require("gulp-plumber");    // エラーが発生しても強制終了させない
const notify = require("gulp-notify");      // エラー発生時のアラート出力
const postcss = require("gulp-postcss");    // PostCSS利用
const cssnext = require("postcss-cssnext")  // CSSNext利用
const cleanCSS = require("gulp-clean-css"); // 圧縮
const rename = require("gulp-rename");      // ファイル名変更
const sourcemaps = require("gulp-sourcemaps");  // ソースマップ作成
const mqpacker = require('css-mqpacker');     //メディアクエリをまとめる

//js babel
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

//ファイル監視
const browserSync = require("browser-sync");

// //画像圧縮
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
// const imageminSvgo = require("imagemin-svgo");

//postcss-cssnext ブラウザ対応条件 prefix 自動付与
const browsers = [
 'last 2 versions',
 '> 5%',
 'ie = 11',
 'not ie <= 10',
 'ios >= 8',
 'and_chr >= 5',
 'Android >= 5',
]

//参照元パス
const srcPath = {
  css: 'src/scss/**/**.scss',
  js: 'src/js/*.js',
  img: 'src/img/**/*',
  // html: './**/*.html', 
    html: 'src/*.html', 

  php: './**/*.php',
 }

//出力先パス
const destPath = {
  css: 'dist/css/',
  js: 'dist/js/',
  img: 'dist/img/',
  html: 'dist/',
 }
 

//sass
const cssSass = () => {
 return src(srcPath.css) //コンパイル元
   .pipe(sourcemaps.init())//gulp-sourcemapsを初期化
   .pipe(
     plumber(              //エラーが出ても処理を止めない
       {
         errorHandler: notify.onError('Error:<%= error.message %>')
         //エラー出力設定
       }
     )
   )
   .pipe(sass({ outputStyle: 'expanded' }))
   .pipe(postcss([mqpacker()])) // メディアクエリを圧縮
   .pipe(postcss([cssnext(browsers)]))//cssnext
   .pipe(sourcemaps.write('/maps'))  //ソースマップの出力
   .pipe(dest(destPath.css))         //コンパイル先
   .pipe(cleanCSS()) // CSS圧縮
   .pipe(
     rename({
       extname: '.min.css' //.min.cssの拡張子にする
     })
 )
}

//  * html
//  */
const html = () => {
  return src(srcPath.html)
    .pipe(dest(destPath.html))
}

// babelのトランスパイル、jsの圧縮
const jsBabel = () => {
  return src(srcPath.js)
    .pipe(
      plumber(              //エラーが出ても処理を止めない
        {
          errorHandler: notify.onError('Error: <%= error.message %>')
        }
      )
    )
    .pipe(babel({
      presets: ['@babel/preset-env']  // gulp-babelでトランスパイル
    }))
    .pipe(dest(destPath.js))
    .pipe(uglify()) // js圧縮
    .pipe(
      rename(
        { extname: '.min.js' }
      )
    )
    .pipe(dest(destPath.js))
        .pipe(notify({
      message: 'Sassをコンパイルしました！',
      onLast: true
    }))

 }
 
const imageminOption = [
  imageminPngquant({ quality: [.65, .80] }),　//任意で追加
  imageminMozjpeg({ quality: 80 }),　//デフォルト（新）
  imagemin.gifsicle(),　//デフォルト
  imagemin.optipng(),　//デフォルト
  // imagemin.jpegtran(),　//ここを削除する
  imagemin.svgo()　//デフォルト
];

const imgImagemin = () => {
  return src('./src/img/*')
      .pipe(imagemin(imageminOption))
      .pipe(dest('./dist/img'));
};


//ローカルサーバー立ち上げ、ファイル監視と自動リロード
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
 }
 const browserSyncOption = {
  // proxy: 'http://localhost/',       //環境によって変更する
  // open: true,
  // reloadOnRestart: true,
  server: './dist'

 }
 
// /**
//  * ローカルサーバー立ち上げ
//  */
// const browserSyncFunc = () => {
//   browserSync.init(browserSyncOption);
// }

// const browserSyncOption = {
//   server: '../dist'
// }



 //リロード
 const browserSyncReload = (done) => {
  browserSync.reload();
  done();
 }
 
 //ファイル監視
 const watchFiles = () => {
  watch(srcPath.css, series(cssSass, browserSyncReload))
  watch(srcPath.js, series(jsBabel, browserSyncReload))
  watch(srcPath.img, series(imgImagemin, browserSyncReload))
  // watch(srcPath.html, series(browserSyncReload))
  watch(srcPath.html, series(html, browserSyncReload))

  watch(srcPath.php, series(browserSyncReload))
 }
 
 exports.default = series(series(cssSass, jsBabel, imgImagemin), parallel(watchFiles, browserSyncFunc));







// const gulp = require('gulp');//gulp本体

// //scss
// const sass = require('gulp-dart-sass');//Dart Sass はSass公式が推奨 @use構文などが使える
// const plumber = require("gulp-plumber"); // エラーが発生しても強制終了させない
// const notify = require("gulp-notify"); // エラー発生時のアラート出力
// const browserSync = require("browser-sync"); //ブラウザリロード


// // 入出力するフォルダを指定
// const srcBase = '../_static/src';
// const assetsBase = '../_assets';
// const distBase = '../_static/dist';


// const srcPath = {
//   'scss': assetsBase + '/scss/**/*.scss',
//   'html': srcBase + '/**/*.html'
// };

// const distPath = {
//   'css': distBase + '/css/',
//   'html': distBase + '/'
// };

// /**
//  * sass
//  *
//  */
// const cssSass = () => {
//   return gulp.src(srcPath.scss, {
//     sourcemaps: true
//   })
//     .pipe(
//       //エラーが出ても処理を止めない
//       plumber({
//         errorHandler: notify.onError('Error:<%= error.message %>')
//       }))
//     .pipe(sass({ outputStyle: 'expanded' })) //指定できるキー expanded compressed
//     .pipe(gulp.dest(distPath.css, { sourcemaps: './' })) //コンパイル先
//     .pipe(browserSync.stream())
//     .pipe(notify({
//       message: 'Sassをコンパイルしました！',
//       onLast: true
//     }))
// }


// /**
//  * html
//  */
// const html = () => {
//   return gulp.src(srcPath.html)
//     .pipe(gulp.dest(distPath.html))
// }

// /**
//  * ローカルサーバー立ち上げ
//  */
// const browserSyncFunc = () => {
//   browserSync.init(browserSyncOption);
// }

// const browserSyncOption = {
//   server: distBase
// }

// /**
//  * リロード
//  */
// const browserSyncReload = (done) => {
//   browserSync.reload();
//   done();
// }

// /**
//  *
//  * ファイル監視 ファイルの変更を検知したら、browserSyncReloadでreloadメソッドを呼び出す
//  * series 順番に実行
//  * watch('監視するファイル',処理)
//  */
// const watchFiles = () => {
//   gulp.watch(srcPath.scss, gulp.series(cssSass))
//   gulp.watch(srcPath.html, gulp.series(html, browserSyncReload))
// }

// /**
//  * seriesは「順番」に実行
//  * parallelは並列で実行
//  */
// exports.default = gulp.series(
//   gulp.parallel(html, cssSass),
//   gulp.parallel(watchFiles, browserSyncFunc)
// );


 
//  exports.default = series(cssSass, jsBabel, imgImagemin);