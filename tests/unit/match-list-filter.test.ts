import { matchListFilter } from "src/svelte/app/services/filters/custom/match-list-filter";
import { ListFilterCondition } from "src/types";

describe('matchListFilter', () => {

	describe('Normal Cases', () => {
		it('should return true for matchListFilter(["apple", "banana", "cherry"], ["banana"], ListFilterCondition.CONTAINS, false)', () => {
			// Arrange
			const propertyValue = ["apple", "banana", "cherry"];
			const compare = ["banana"];
			const condition = ListFilterCondition.CONTAINS;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchListFilter(["apple", "banana", "cherry"], ["banana", "apple"], ListFilterCondition.CONTAINS, false)', () => {
			// Arrange
			const propertyValue = ["apple", "banana", "cherry"];
			const compare = ["banana", "apple"];
			const condition = ListFilterCondition.CONTAINS;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchListFilter(["apple pie", "banana", "cherry"], ["apple"], ListFilterCondition.CONTAINS, false)', () => {
			// Arrange
			const propertyValue = ["apple pie", "banana", "cherry"];
			const compare = ["apple"];
			const condition = ListFilterCondition.CONTAINS;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchListFilter(["apple", "banana", "cherry"], ["grape"], ListFilterCondition.DOES_NOT_CONTAIN, false)', () => {
			// Arrange
			const propertyValue = ["apple", "banana", "cherry"];
			const compare = ["grape"];
			const condition = ListFilterCondition.DOES_NOT_CONTAIN;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchListFilter(["apple", "banana", "cherry"], ["grape", "melon"], ListFilterCondition.DOES_NOT_CONTAIN, false)', () => {
			// Arrange
			const propertyValue = ["apple", "banana", "cherry"];
			const compare = ["grape", "melon"];
			const condition = ListFilterCondition.DOES_NOT_CONTAIN;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return false for matchListFilter(["apple pie", "banana", "cherry"], ["apple"], ListFilterCondition.DOES_NOT_CONTAIN, false)', () => {
			// Arrange
			const propertyValue = ["apple pie", "banana", "cherry"];
			const compare = ["apple"];
			const condition = ListFilterCondition.DOES_NOT_CONTAIN;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});

		it('should return true for matchListFilter(["apple", "banana", "cherry"], [], ListFilterCondition.CONTAINS, false)', () => {
			// Arrange
			const propertyValue = ["apple", "banana", "cherry"];
			const compare: string[] = [];
			const condition = ListFilterCondition.CONTAINS;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchListFilter(["apple", "banana", "cherry"], [], ListFilterCondition.DOES_NOT_CONTAIN, false)', () => {
			// Arrange
			const propertyValue = ["apple", "banana", "cherry"];
			const compare: string[] = [];
			const condition = ListFilterCondition.DOES_NOT_CONTAIN;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchListFilter(["apple", "banana"], ["apple"], ListFilterCondition.CONTAINS, false)', () => {
			// Arrange
			const propertyValue = ["apple", "banana"];
			const compare = ["apple"];
			const condition = ListFilterCondition.CONTAINS;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchListFilter(["apple", "banana"], ["cherry"], ListFilterCondition.DOES_NOT_CONTAIN, false)', () => {
			// Arrange
			const propertyValue = ["apple", "banana"];
			const compare = ["cherry"];
			const condition = ListFilterCondition.DOES_NOT_CONTAIN;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});
	});

	describe('Invalid Cases', () => {
		it('should return false for matchListFilter(null, ["apple"], ListFilterCondition.CONTAINS, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = ["apple"];
			const condition = ListFilterCondition.CONTAINS;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});

		it('should return false for matchListFilter(null, ["banana"], ListFilterCondition.DOES_NOT_CONTAIN, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = ["banana"];
			const condition = ListFilterCondition.DOES_NOT_CONTAIN;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});
	});

	describe('Edge Cases', () => {
		it('should return false for matchListFilter(null, ["apple"], ListFilterCondition.EXISTS, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = ["apple"];
			const condition = ListFilterCondition.EXISTS;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});

		it('should return true for matchListFilter(null, ["banana"], ListFilterCondition.DOES_NOT_EXIST, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = ["banana"];
			const condition = ListFilterCondition.DOES_NOT_EXIST;
			const matchIfNull = false;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchListFilter(null, ["apple"], ListFilterCondition.CONTAINS, true)', () => {
			// Arrange
			const propertyValue = null;
			const compare = ["apple"];
			const condition = ListFilterCondition.CONTAINS;
			const matchIfNull = true;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchListFilter(null, ["banana"], ListFilterCondition.DOES_NOT_CONTAIN, true)', () => {
			// Arrange
			const propertyValue = null;
			const compare = ["banana"];
			const condition = ListFilterCondition.DOES_NOT_CONTAIN;
			const matchIfNull = true;

			// Act
			const result = matchListFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});
	});

	describe('Error Cases', () => {
		it('should throw an error for matchListFilter(["apple"], ["apple"], "unsupported-condition", false)', () => {
			// Arrange
			const propertyValue = ["apple"];
			const compare = ["apple"];
			const condition = 'unsupported-condition' as ListFilterCondition;
			const matchIfNull = false;

			// Act & Assert
			expect(() => matchListFilter(propertyValue, compare, condition, matchIfNull)).toThrow();
		});
	});
});
