const phase = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

if (phase === "development") {
  require("dotenv").config();
}

const webpack = require("webpack");
const path = require("path");

const WebpackAssetsManifest = require("webpack-assets-manifest");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const defaultOptions = {
  webAppPath: path.resolve(__dirname + "/src/", "webApp.tsx"),
  cwd: process.cwd()
};

module.exports = function(options = defaultOptions) {
  return async function() {
    const devMode = phase === "development";

    console.log("BUILDING...");
    console.log("PHASE:", phase);
    console.log("HOST:", process.env.APP_HOST);

    const config = {
      context: options.cwd,
      mode: phase,
      entry: { app: options.webAppPath },
      output: {
        path: path.join(options.cwd, "./pub/static/"),
        publicPath: devMode
          ? "http://127.0.0.1:4115/"
          : process.env.APP_HOST + "/static/",
        filename: "[name].[hash].js",
        chunkFilename: "[name].[hash].js"
      },
      resolve: {
        extensions: [
          "*",
          ".mjs",
          ".js",
          ".json",
          ".gql",
          ".graphql",
          ".tsx",
          ".d.ts",
          ".ts",
          ".js"
        ],
        plugins: [
          new TsconfigPathsPlugin({
            configFile: path.join(options.cwd, "tsconfig.json")
          })
        ],
        alias: { "react-dom": "@hot-loader/react-dom" }
      },
      module: {
        rules: [
          {
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto"
          },
          { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
          {
            test: /\.(jpg|png|svg|woff|ttf|eot)$/,
            use: [{ loader: "file-loader", options: {} }]
          }
        ]
      },
      performance: { hints: "warning" },
      plugins: [
        new WebpackAssetsManifest({
          // Options go here
          writeToDisk: true,
          publicPath: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
          "process.env": {
            NODE_ENV: JSON.stringify(phase),
            APP_ENV: JSON.stringify("browser")
          }
        })
      ],
      optimization: {}
    };

    if (devMode) {
      // config.entry.vendor = libs;
      // config.devtool = 'source-map'
      config.devtool = "eval";

      console.log("DEV MODE!");
      config.devServer = {
        // contentBase: path.join(options.cwd, "dist"),
        // compress: true,
        port: 4115,
        // writeToDisk: true,
        hotOnly: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers":
            "X-Requested-With, content-type, Authorization"
        }
      };

      config.plugins.push(
        new webpack.NamedChunksPlugin(),
        new webpack.NamedModulesPlugin()
      );

      if (process.env.ANALYZE) {
        config.plugins.push(new BundleAnalyzerPlugin());
      }
    } else if (phase === "production") {
    } else {
      throw Error(`Unsupported environment phase in webpack config: `);
    }

    return config;
  };
};
