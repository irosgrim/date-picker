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
  lintOnSave: process.env.NODE_ENV !== 'production'
}