module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/date-picker/dist/'
        : '/',
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        }
    },
    configureWebpack: {
        devtool: 'source-map'
    },
    lintOnSave: process.env.NODE_ENV !== 'production'
}