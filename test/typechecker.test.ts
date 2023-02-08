import { TypeChecker } from '../index';

jest.mock('../index', () => {
	const module = jest.requireActual('../index');
	return {
		__esModule: true,
		TypeChecker: {
			getConfig: jest.fn().mockReturnValue({
				types: ['Artist', 'Album', 'Venue'],
				locations: ['./test/types.ts']
			}),
			getType: module.TypeChecker.getType
		}
	};
});

describe('Typechecker', () => {

	describe('Custom type identification', () => {

		it('Will identify an Artist', () => {
			const item = {
				name: 'Bruce Springsteen',
				mbid: '70248960-cb53-4ea4-943a-edb18f7d336f'
			};
			const type = TypeChecker.getType(item);

			expect(type).toEqual(expect.arrayContaining(['Artist']));
		});

		it('Will identify an Album', () => {
			const item = {
				title: 'Jagged Little Pill',
				barcode: '0 9362-45901-2 5',
				artist: ['Alanis Morissette']
			};
			const type = TypeChecker.getType(item);

			expect(type).toEqual(expect.arrayContaining(['Album']));
		});

		it('Will not identify a type not specified in the config', () => {
			type Concert = {
				date: string;
				venue: string;
			}
			const item = {
				date: '2023-01-14',
				venue: 'AAMI Park'
			};
			const type = TypeChecker.getType(item);

			expect(type).not.toEqual(['Concert']);
			expect(type).toEqual(['object']);
		});

		it('Will warn about multiple matches', () => {
			const logSpy = jest.spyOn(console, 'warn');

			const item = {
				name: 'The E Street Band'
			};
			const type = TypeChecker.getType(item);

			expect(type).toEqual(['Artist', 'Venue']);
			expect(logSpy).toHaveBeenCalledTimes(1);
			expect(logSpy).toHaveBeenCalledWith('Type check returned more than one match. This may lead to unexpected results.');
		});
	});

	describe('Primitive type identification', () => {

		it('Will return string type in the same format as custom types', () => {
			const item = 'Purple monkey dishwasher';
			const type = TypeChecker.getType(item);

			expect(type).toEqual(['string']);
		});

		it('Will return number type in the same format as custom types', () => {
			const item = 1300655506;
			const type = TypeChecker.getType(item);

			expect(type).toEqual(['number']);
		});
	});

});
