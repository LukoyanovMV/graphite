const path = require('path');
const webpack =  require('webpack');
const merge = require('webpack-merge');
const devServerHost = 'http://localhost';
const devServerPort = 8080;

const entry = 'index.js';
const sourceDir = 'src';
const buildName = 'graphite.js';
const buildDir = 'dist';
const debugDir = 'debug';
const libraryEntry = 'G';

// *****************************************************************************
// Base webpack config
// *****************************************************************************
let config = {
    context: path.join(__dirname, sourceDir),

    entry: [
        './' + entry
    ],

    output: {
        filename: buildName,
        path: path.join(__dirname, buildDir),
        library: libraryEntry,
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'stage-0'],
                        plugins: ['syntax-dynamic-import']
                    }
                }]
            }
        ]
    },

    plugins: []
};

// *****************************************************************************
// Webpack config for development
// *****************************************************************************
const configDev = {
    devtool: 'cheap-module-eval-source-map',
    // devtool: 'sourcemap',

    output: {
        path: path.join(__dirname, debugDir),
        publicPath: `${devServerHost}:${devServerPort}/`
    }
};

// *****************************************************************************
// Webpack config for production
// *****************************************************************************
const configProd = {
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
};

// *****************************************************************************
// Merging configs
// *****************************************************************************
if (process.env.NODE_ENV === 'development') {
    config = merge(config, configDev);
} else if (process.env.NODE_ENV === 'production') {
    config = merge(config, configProd);
}

module.exports = config;
