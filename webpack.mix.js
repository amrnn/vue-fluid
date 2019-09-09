let mix = require('laravel-mix');

mix.js('src/index.js', 'dist/');

mix.webpackConfig({
	output: {
		library: 'vue-fluid',
		libraryTarget: 'umd',
		umdNamedDefine: true
	}
});