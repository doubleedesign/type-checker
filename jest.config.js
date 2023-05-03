const config = {
	testEnvironment: 'node',
	rootDir: './test',
	transform: {
		'^.+\\.(ts)?$':  ['babel-jest', {
			presets: [
				['@babel/preset-env', { targets: { node: 'current' } }],
				'@babel/preset-typescript',
			],
			plugins: [
			]
		}]
	},
	transformIgnorePatterns: ['<rootDir>/node_modules/']
};

export default config;
