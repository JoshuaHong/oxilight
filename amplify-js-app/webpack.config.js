const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        'index': path.resolve(__dirname, './src/index/index.js'),
        'dashboard': path.resolve(__dirname, './src/dashboard/dashboard.js'),
        'general': path.resolve(__dirname, './src/dashboard/menu/settings/general/general.js'),
        'account': path.resolve(__dirname, './src/dashboard/menu/settings/account/account.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        overlay: true,
        hot: true
    },
    plugins: [
        new CopyWebpackPlugin(['index.html']),
        new webpack.HotModuleReplacementPlugin()
    ]
};
