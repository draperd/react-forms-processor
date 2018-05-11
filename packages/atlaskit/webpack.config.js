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
    "styled-components": "styled-components",
    "@atlaskit/button": "@atlaskit/button",
    "@atlaskit/checkbox": "@atlaskit/checkbox",
    "@atlaskit/field-radio-group": "@atlaskit/field-radio-group",
    "@atlaskit/field-range": "@atlaskit/field-range",
    "@atlaskit/field-text": "@atlaskit/field-text",
    "@atlaskit/field-text-area": "@atlaskit/field-text-area",
    "@atlaskit/icon": "@atlaskit/icon",
    "@atlaskit/multi-select": "@atlaskit/multi-select",
    "@atlaskit/single-select": "@atlaskit/single-select",
    "@atlaskit/tooltip": "@atlaskit/tooltip"
  },
  devtool: "source-map"
};
