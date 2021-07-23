const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_JS = "./src/client/js/";

module.exports = {
    watch: true,
    mode: "development",
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css"
    })],
    entry: {
        //app: ['babel-polyfill', BASE_JS + "commentSection.js"],
        main: BASE_JS + "main.js",
        commentSection: BASE_JS + "commentSection.js",
    },
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, 'assets'),
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
                            ['@babel/preset-env', { targets: { browsers: ['last 2 chrome versions'] } }]
                        ]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ]
    }
}