var webpack = require('webpack');

module.exports = {

	entry: ['./plugin.js'],

	module: {
		loaders: [
			{ test: /\.html$/, loader: 'html' },
			{ test: /\.css$/,  loader: 'style!css' }
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		})
	],

	output: {
		filename: './bundle.min.js'
	},

	resolve: {
		// Allow to omit extensions when requiring these files
		extensions: ['', '.js']
	}
};
