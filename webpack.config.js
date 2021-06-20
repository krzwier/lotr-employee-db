var path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main/js/app.js',
    cache: true,
    output: {
        path: path.resolve(__dirname, "./src/main/resources/static/built"),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }]
            }
        ]
    },
    devtool: 'source-map'
};