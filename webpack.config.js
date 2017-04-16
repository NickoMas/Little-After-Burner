module.exports = {
    entry: "./script.js",
    output: {
        filename: "bundle.js"
    },
    module: {
        rules:[
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loader:"jshint-loader"
            },
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
}
