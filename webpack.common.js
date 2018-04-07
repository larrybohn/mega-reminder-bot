const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const outputPath = path.resolve(__dirname, 'build', 'web', 'public');
module.exports = {
    entry: {
        app: './src/web/public/scripts/index.js'//,
        //vendors
    },
    output: {
        filename: 'assets/[name].bundle.js',
        path: outputPath,
        publicPath: '/'
    },
    plugins: [
        new CleanWebpackPlugin([outputPath]),
        new HtmlWebpackPlugin({
            template: './src/web/public/index.html'
        }),
        //new BundleAnalyzerPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'src/web/public/scripts'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
    }
};