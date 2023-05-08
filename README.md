# type-checker

Provides the ability to check which TypeScript type(s) an object is anywhere in your code in a Node development environment.

### Example setup
```json5
// tsconfig.json
{
    "compilerOptions": {
        "baseUrl": "./",
        "module": "esnext",
        "target": "esnext",
        "moduleResolution": "node",
        // ... more options as you need
    },
    "typechecker": {
        "types": ["Artist", "Album"], // names of the types you want to be able to check against 
        "locations": ["./types.ts"] // where the type definitions are located 
    }
}
```

### Example usage
```ts
import { TypeChecker } from '@doubleedesign/type-checker';

const boss: Artist = { name: 'Bruce Springsteen' };
const type: string[] = TypeChecker.getType(boss); // ['Artist']
```

### Notes

- For performance reasons, this may not be production-ready. So far my main use of it has been for unit testing.
- This only checks for matching object keys, not that the values are the correct type. 

### Roadmap/future goals

- Make it check value types, not just key names
- Make it work in the browser.
- Improve performance.
