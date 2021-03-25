const path = require("path");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devServer: {
    host: "https://kennedy-staging1.gojitech.systems",
    port: 8080,
    contentBase: path.resolve(__dirname, "../src"),
    historyApiFallback: true,
    hot: true,
  },
  entry: {
    staging: path.resolve(__dirname, "../src/index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "..", "build"),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/staging/manifest.json", to: "[name][ext]" },
        { from: "public/background.js", to: "[name][ext]" },
        { from: "public/contentScript.js", to: "[name][ext]" },
        { from: "public/RecordRTC.js", to: "[name][ext]" },
        { from: "public/*.png", to: "[name][ext]" },
        { from: "src/*.css", to: "[name][ext]" },
        { from: "src/assets", to: "assets" },
      ],
    }),
    new Dotenv({
      path: "./.env.staging",
      safe: true,
      allowEmptyValues: true,
      systemvars: true,
    }),
  ],
};
