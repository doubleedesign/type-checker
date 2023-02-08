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
				'@babel/plugin-syntax-import-assertions',
				'@babel/plugin-syntax-top-level-await'
			]
		}]
	},
	transformIgnorePatterns: ['<rootDir>/node_modules/']
};

export default config;
