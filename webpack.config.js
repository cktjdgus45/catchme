const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_JS = "./src/client/js/";

module.exports = {
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css"
    })],
    entry: {
        main: BASE_JS + "main.js",
        commentSection: BASE_JS + "commentSection.js",
        preview: BASE_JS + "preview.js",
        singlePage: BASE_JS + "singlePage.js",
        videoPlayer: BASE_JS + "videoPlayer.js",
        bulma: BASE_JS + "bulma.js",
        slider: BASE_JS + "slider.js",
        videoRecord: BASE_JS + "videoRecord.js",
        myProfile: BASE_JS + "myProfile.js"
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