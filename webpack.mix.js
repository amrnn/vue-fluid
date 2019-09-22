let mix = require('laravel-mix');

mix.js('src/index.js', 'dist/');

mix.webpackConfig({
	output: {
		library: 'vue-fluid',
		libraryTarget: 'umd',
		umdNamedDefine: true,

		// Needed for usage with SSR, see:https://stackoverflow.com/questions/49111086/webpack-4-universal-library-target
		globalObject: "typeof self !== 'undefined' ? self : this"
	},
});