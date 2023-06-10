import * as TJS from 'typescript-json-schema';
import pkg from 'typescript';
const { sys, findConfigFile, readConfigFile, parseJsonConfigFileContent } = pkg;
import * as path from 'path';
export const TypeChecker = {
    /**
     * Get config from project tsconfig
     *
     * @returns {Config} - List of type names and list of locations of type definitions
     */
    getConfig: function () {
        const tsconfigPath = findConfigFile(process.cwd(), sys.fileExists, 'tsconfig.json');
        const tsconfigFile = readConfigFile(tsconfigPath, sys.readFile);
        const parsedTsconfig = parseJsonConfigFileContent(tsconfigFile.config, sys, path.dirname(tsconfigPath));
        return {
            types: parsedTsconfig.raw.typechecker.types,
            locations: parsedTsconfig.raw.typechecker.locations
        };
    },
    /**
     * Function to compile the schemas of the given types into a simplified format
     * TODO: If this could be cached, maybe it could speed up the use of getType()
     *
     * @returns {BasicSchema[]} - Array of simplified type schemas
     */
    getAllTypeSchemas: function () {
        const config = this.getConfig();
        const typesToCheck = config.types;
        const formatted = [];
        const program = TJS.getProgramFromFiles(config.locations.map((item) => {
            return path.resolve(item);
        }));
        const settings = {
            required: true,
        };
        const generator = TJS.buildGenerator(program, settings);
        [...typesToCheck].forEach((type) => {
            const schema = TJS.generateSchema(program, type, settings, [], generator);
            // Handle basic types (schema is a single Definition)
            if (schema.properties) {
                formatted.push({
                    name: type,
                    properties: Object.keys(schema.properties),
                    required: schema.required || []
                });
            }
            // Handle intersection types (schema is an array of Definitions)
            if (schema.allOf) {
                const intersection = { name: type, properties: [], required: [] };
                schema.allOf.forEach((definition) => {
                    if (definition.type && definition.properties) {
                        intersection.properties.push(...Object.keys(definition.properties));
                        definition.required && intersection.required.push(...definition.required);
                    }
                });
                formatted.push(intersection);
            }
        });
        return formatted;
    },
    /**
     * Determine the TypeScript type of the given value
     * using a predefined list of types
     * @param item - The value to check
     * @returns string[] - Array of types specified in the function that the item satisfies
     */
    getType: function (item) {
        if (typeof item !== 'object') {
            return [typeof item];
        }
        const typeSchemas = this.getAllTypeSchemas();
        const itemProperties = Object.keys(item);
        const matches = [];
        typeSchemas.forEach((type) => {
            // 1. Check that all the type's required fields are present in the item: Alone, this would return all match candidates
            // 2. Check that all the item's fields are valid properties of the type: Find closer matches by considering all fields
            if (type.required.every(prop => itemProperties.includes(prop)) && itemProperties.every(prop => type.properties.includes(prop))) {
                matches.push(type.name);
            }
        });
        if (matches.length > 1) {
            console.warn('Type check returned more than one match. This may lead to unexpected results.');
        }
        if (matches.length < 1) {
            return ['object'];
        }
        return matches;
    }
};
