// webpack.config.js
const path = require("path");

module.exports = {
  mode: "development", // Change to 'production' for production builds
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
    clean: true, // Cleans the output directory before emit
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
    open: true, // Automatically opens the browser
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource", // Handles image assets
      },
      // Add more loaders here if needed (e.g., for CSS)
    ],
  },
  resolve: {
    extensions: [".js"],
  },
};
