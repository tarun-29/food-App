const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    //po,yfill is used because some features can't be converted into es5 so polyfill will convert them
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin ({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, //it will search for all javascript file
                exclude: /node_modules/, // we have to exclude node modules otherwise babel-loader will apply on this also
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};