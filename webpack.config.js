const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: './src/js/main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: 'assets/[hash][ext][query]'
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html'
		})
	],
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist')
		},
		compress: true,
		port: 9000,
		hot: true,
		open: true
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [['postcss-preset-env']]
							}
						}
					},
					'sass-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'img/[name][ext]'
				}
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]'
				}
			}
		]
	}
};
