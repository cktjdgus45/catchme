const path = require('path');
const BASE_JS = "./src/client/js/";

module.exports = {
    watch: true,
    mode: "development",
    entry: {
        main: BASE_JS + "main.js",
        commentSection: BASE_JS + "commentSection.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'assets', 'js'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            }
        ]
    }
}