const webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/web/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/../../_build-web"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    plugins: [
      new webpack.ProvidePlugin({
          jQuery: 'jquery',
          React: 'react',
          ReactDOM: 'react-dom'
      }),
      new HtmlWebpackPlugin({
        hash: true,
        template: "./src/web/index.ejs",
        filename: "./index.html"
      }),
    ],

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { 
              test: /\.tsx?$/,
              loader: "awesome-typescript-loader",
              options: {
                configFileName: 'src/web/tsconfig.json'
              },
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            {
              test: /\.css$/,
              use: [ 'style-loader', 'css-loader' ]
            },
            { 
              test: /\.png$/, 
              loader: "url-loader?limit=100000" 
            },
            { 
              test: /\.jpg$/, 
              loader: "file-loader" 
            },
            {
              test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
              loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
              test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
              loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            {
              test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
              loader: 'file-loader'
            },
            {
              test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
              loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            }
        ]
    }
};