import * as TJS from 'typescript-json-schema';
import { sys as tsSys, findConfigFile, readConfigFile, parseJsonConfigFileContent } from 'typescript';
import * as path from 'path';
import { Definition } from 'typescript-json-schema';

export const TypeChecker = {

	/**
	 * Get config from project tsconfig
	 */
	getConfig: function() {
		const tsconfigPath = findConfigFile(process.cwd(), tsSys.fileExists, 'tsconfig.json');
		const tsconfigFile = readConfigFile(tsconfigPath, tsSys.readFile);
		const parsedTsconfig = parseJsonConfigFileContent(
			tsconfigFile.config,
			tsSys,
			path.dirname(tsconfigPath)
		);

		return {
			types: parsedTsconfig.raw.typechecker.types,
			locations: parsedTsconfig.raw.typechecker.locations
		};
	},

	/**
	 * Determine the TypeScript type of a given value
	 * using a predefined list of types
	 * @param item - The value to check
	 * @returns string[] - Array of types specified in the function that the item satisfies
	 */
	getType: function(item: unknown): string[] {
		if(typeof item !== 'object') {
			return [typeof item];
		}

		const config = this.getConfig();
		const typesToCheck = config.types;
		const itemProperties = Object.keys(item);
		const matches = [];

		const settings: TJS.PartialArgs = {
			required: true,
		};

		const program = TJS.getProgramFromFiles(
			config.locations.map((item) => {
				return path.resolve(item);
			})
		);

		const generator = TJS.buildGenerator(program, settings);

		[...typesToCheck].forEach((type) => {
			const schema = TJS.generateSchema(program, type, settings, [], generator);
			let allProperties = [];
			let requiredProperties = [];

			// Handle basic types (schema is a single Definition)
			if(schema.properties) {
				allProperties = [...allProperties, ...Object.keys(schema.properties)];
				requiredProperties = schema.required ? [...requiredProperties, ...schema.required] : [...requiredProperties];
			}

			// Handle intersection types (schema is an array of Definitions)
			schema.allOf && schema.allOf.forEach((definition: Definition) => {
				allProperties = [...allProperties, ...Object.keys(definition.properties)];
				requiredProperties = [...requiredProperties, ...definition.required];
			});

			if(requiredProperties && requiredProperties.every(prop => itemProperties.includes(prop))) {
				matches.push(type);
			}
		});

		if(matches.length > 1) {
			console.warn('Type check returned more than one match. This may lead to unexpected results.');
		}

		if(matches.length < 1) {
			return ['object'];
		}

		return matches;
	}
};
