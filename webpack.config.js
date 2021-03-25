const { merge } = require("webpack-merge");
const commonConfig = require("./config/webpack.common");

module.exports = ({ env }) => {
  console.log("env--------------", env);
  const config = require("./config/webpack." + env);
  return merge(commonConfig, config);
};
