const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  chunks: [],
  inject: false,
  template: path.join(__dirname, "src/index.html"),
  filename: "index.html"
});

module.exports = {
  entry: {
    index: path.join(__dirname, "src/index.js")
  },
  output: {
    publicPath: "/",
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [htmlWebpackPlugin],
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devServer: {
    port: 3001
  },
  devtool: "source-map"
};
