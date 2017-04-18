module.exports = {
    entry: "./js/script.js",
    output: {
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loader:"babel-loader",
                query: {
                    presets: 'es2015'
                }
            },
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loader: "jshint-loader"
            }
        ]
    }
}
