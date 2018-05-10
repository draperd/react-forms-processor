const path = require("path");

module.exports = {
  entry: {
    index: path.join(__dirname, "src/index.js")
  },
  output: {
    publicPath: "/",
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "commonjs2"
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
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devServer: {
    port: 3001
  },
  externals: {
    react: "commonjs react",
    "react-forms-processor": "react-forms-processor",
    "react-forms-processor-atlaskit": "react-forms-processor-atlaskit"
  },
  devtool: "source-map"
};
