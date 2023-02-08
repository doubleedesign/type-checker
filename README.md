# type-checker

A work-in-progress tool to provide the ability to check which TypeScript type(s) an object is anywhere in your code.

Example setup: 
```json lines
// tsconfig.json
{
	"compilerOptions": {
		"option": "your_usual_options_here"
	},
	"typechecker": {
		"types": ["Artist", "Album"], // names of the types you want to be able to check against 
		"locations": ["./types.ts"] // where the type definitions are located 
	}
}
```

Example usage:
```ts
import { TypeChecker } from '@doubleedesign/type-checker';

const boss: Artist = { name: 'Bruce Springsteen' };
const type: string[] = TypeChecker.getType(boss); // ['Artist']
```
