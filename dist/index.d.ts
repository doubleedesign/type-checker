type Config = {
    types: string[];
    locations: string[];
};
type BasicSchema = {
    name: string;
    properties: string[];
    required: string[];
};
export declare const TypeChecker: {
    /**
     * Get config from project tsconfig
     *
     * @returns {Config} - List of type names and list of locations of type definitions
     */
    getConfig: () => Config;
    /**
     * Function to compile the schemas of the given types into a simplified format
     * TODO: If this could be cached, maybe it could speed up the use of getType()
     *
     * @returns {BasicSchema[]} - Array of simplified type schemas
     */
    getAllTypeSchemas: () => BasicSchema[];
    /**
     * Determine the TypeScript type of the given value
     * using a predefined list of types
     * @param item - The value to check
     * @returns string[] - Array of types specified in the function that the item satisfies
     */
    getType: (item: unknown) => string[];
};
export {};
