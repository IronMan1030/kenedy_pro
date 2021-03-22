const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
module.exports = {
  mode: "none",
  devServer: {
    host: "localhost", // Your Computer Name
    port: 3000,
    contentBase: path.resolve(__dirname, "./src"),
    historyApiFallback: true,
    hot: true,
  },
  entry: {
    index: path.resolve(__dirname, "./src/index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                {
                  plugins: ["@babel/plugin-proposal-class-properties"],
                },
              ],
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(svg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: "url-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "public/index.html"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/manifest.json", to: "[name][ext]" },
        { from: "public/background.js", to: "[name][ext]" },
        { from: "public/contentScript.js", to: "[name][ext]" },
        { from: "public/RecordRTC.js", to: "[name][ext]" },
        { from: "public/*.png", to: "[name][ext]" },
        { from: "src/*.css", to: "[name][ext]" },
        { from: "src/assets", to: "assets" },
      ],
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new CleanWebpackPlugin(),
    new Dotenv(),
  ],
};
