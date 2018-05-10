const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  chunks: [],
  template: path.join(__dirname, "src/examples/index.html"),
  filename: "examples/index.html"
});

module.exports = {
  // TODO: Swap entry for a function that builds object for all components
  entry: {
    "examples/index": path.join(__dirname, "src/examples/index.js"),
    "components/Form": path.join(__dirname, "src/components/Form.js"),
    "components/FormFragment": path.join(
      __dirname,
      "src/components/FormFragment.js"
    ),
    "renderers/AtlaskitFields": path.join(
      __dirname,
      "src/renderers/AtlaskitFields.js"
    )
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
  }
};
