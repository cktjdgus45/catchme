const path = require('path');

module.exports = {
    watch: true,
    mode: "development",
    entry: "./src/client/js/main.js",
    output: {
        filename: "main.js",
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