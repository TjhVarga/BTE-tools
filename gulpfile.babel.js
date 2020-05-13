const { src, dest, task, parallel } = require('gulp')
const bro = require('gulp-bro')
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const files = glob.sync('src/*.js')

for (let i = 0; i < files.length; i++) {
  task(path.basename(files[i], '.js'), () => {
    return bundle(files[i])
  })
}

function bundle (file) {
  return src(file)
    .pipe(bro({
      transform: [
        ['babelify', {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  firefox: '2'
                }
              }
            ]
          ]
        }],
        ['uglifyify', { global: true }]
      ]
    }))
    .pipe(dest('craftscripts/'))
}

task('copyData', (cb) => {
  fs.mkdir(path.resolve(__dirname, './craftscripts'), (err) => {
    if (err && err.code !== 'EEXIST') throw err
    fs.mkdir(path.resolve(__dirname, './craftscripts/data'), (err) => {
      if (err && err.code !== 'EEXIST') throw err
      fs.copyFile(path.resolve(__dirname, './src/data/conformal.txt'), path.resolve(__dirname, './craftscripts/data/conformal.txt'), (err) => {
        if (err) throw err
        cb()
      })
    })
  })
})

task('default', parallel(files.map((value) => path.basename(value, '.js')), 'copyData'))
