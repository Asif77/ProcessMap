const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const glob = require("glob");

module.exports = {
  entry: {
    "bundle.js": glob.sync("build/static/?(js|css)/main.*.?(js|css)").map(f => path.resolve(__dirname, f)),
  },
  output: {
    filename: "bundle.min.js",
    path: path.resolve(__dirname, 'dist/static/js/')
  },
  //devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new UglifyJsPlugin()],
}






// const path = require("path")
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
// const glob = require("glob")

// module.exports = {
//   entry: {
//     "bundle.js": glob.sync("build/static/?(js|css)/main.*.?(js|css)").map(f => path.resolve(__dirname, f)),
//   },
//   output: {
//     filename: "build/static/js/bundle.min.js",
//   },
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: ["style-loader", "css-loader"],
//       },
//     ],
//   },
//   plugins: [new UglifyJsPlugin()],
// }