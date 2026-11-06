import { nodeConfig } from 'eslint-config-brightspace';

export default [
	...nodeConfig,
	{
		languageOptions: {
			...nodeConfig.languageOptions,
			sourceType: 'commonjs',
		},
	},
	{
		rules: {
			'no-var': ['off'],
		},
	}
];
