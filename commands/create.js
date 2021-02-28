var vfs = require('vinyl-fs');
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

const copyFiles = ['js', 'css'].map(ext => {
    return `./template/*.${ext}`
})
module.exports = function (pName) {
    const cwd = process.cwd()
    console.log('cwd=> ', cwd, pName)
    console.log('output => ', path.resolve(cwd, `./${pName}`))
    vfs.src(copyFiles, { cwd: resolve('')})
        .pipe(vfs.dest(path.resolve(cwd, `./${pName}`)));
    
    // fs.createReadStream('./template').pipe(path.resolve(cwd, `${pName}/`))
}