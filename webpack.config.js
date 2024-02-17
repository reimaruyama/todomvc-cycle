const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    devServer: {
        client: {
            progress: true,
        },
        historyApiFallback: true,
        hot: true,
        port: 3001,
        open: {
            target: '/',
        },
    },
    entry: {
        main: path.join(__dirname, 'src', 'app.ts'),
    },
    experiments: {
        lazyCompilation: true,
    },
    ignoreWarnings: [
        {
            message: /export .* was not found in/,
        },
    ],
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        configFile: path.join(__dirname, 'tsconfig.json'),
                    },
                },
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test:/\.css$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
        ],
        parser: {
            javascript: {
                dynamicImportPrefetch: true,
            },
        },
    },
    resolve: {
        extensions: ['.js', '.tsx', '.ts', '.mjs'],
        fallback: {
            assert: false
        }
    },
    output: {
        chunkFilename: '[name].[contenthash].js',
        filename: '[name].[contenthash].js',
        publicPath: '/',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
};