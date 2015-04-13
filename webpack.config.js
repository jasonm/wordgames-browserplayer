var webpack = require('webpack');  
module.exports = {  
    entry: [
      'webpack/hot/only-dev-server',
      "./js/app.jsx"
    ],
    output: {
        path: __dirname + '/build',
        filename: "bundle.js",
        publicPath: "http://localhost:8080/assets/"
    },
    module: {
        loaders: [
            // { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel'] },
            { test: /\.jsx?$/,  exclude: /node_modules/, loader: 'babel'},
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],
    devServer: {
        contentBase: "./build",
        info: false, //  --no-info option
        hot: true,
        inline: true
    }
};
