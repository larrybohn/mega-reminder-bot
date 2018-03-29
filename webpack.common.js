const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputPath = path.resolve(__dirname, 'build', 'web', 'public');

module.exports = {
    entry: {
        app: './src/web/public/scripts/index.js'//,
        //vendors
    },
    output: {
        filename: '[name].bundle.js',
        path: outputPath
    },
    plugins: [
        new CleanWebpackPlugin([outputPath]),
        new HtmlWebpackPlugin({
            template: './src/web/public/index.html'
        })
    ]
};