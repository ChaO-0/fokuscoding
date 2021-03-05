module.exports = {
	webpackDevMiddleware: (config) => {
		config.watchOptions.poll = 300;
		return config;
	},
	async headers() {
		return [
			{
				source: '/',
				headers: [
					{
						key: 'Cross-Origin-Embedder-Policy',
						value: 'require-corp',
					},
					{
						key: 'Cross-Origin-Opener-Policy',
						value: 'same-origin',
					},
				],
			},
			{
				source: '/home',
				headers: [
					{
						key: 'Cross-Origin-Embedder-Policy',
						value: 'require-corp',
					},
					{
						key: 'Cross-Origin-Opener-Policy',
						value: 'same-origin',
					},
				],
			},
		];
	},
};
