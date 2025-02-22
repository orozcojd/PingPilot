const rules = require('./webpack.rules');

rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-react', '@babel/preset-env']
    }
  }
},
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  }

);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
