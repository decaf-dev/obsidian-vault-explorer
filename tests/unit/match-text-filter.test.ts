import { matchTextFilter } from "src/svelte/app/services/filters/custom/match-text-filter";
import { TextFilterCondition } from "src/types";

describe('matchTextFilter', () => {

	describe('Normal Cases', () => {
		it('should return true for matchTextFilter("hello", "hello", TextFilterCondition.IS, false)', () => {
			// Arrange
			const propertyValue = "hello";
			const compare = "hello";
			const condition = TextFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchTextFilter("world", "world", TextFilterCondition.IS, false)', () => {
			// Arrange
			const propertyValue = "world";
			const compare = "world";
			const condition = TextFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchTextFilter("hello", "world", TextFilterCondition.IS_NOT, false)', () => {
			// Arrange
			const propertyValue = "hello";
			const compare = "world";
			const condition = TextFilterCondition.IS_NOT;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchTextFilter("world", "hello", TextFilterCondition.IS_NOT, false)', () => {
			// Arrange
			const propertyValue = "world";
			const compare = "hello";
			const condition = TextFilterCondition.IS_NOT;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchTextFilter("hello world", "world", TextFilterCondition.CONTAINS, false)', () => {
			// Arrange
			const propertyValue = "hello world";
			const compare = "world";
			const condition = TextFilterCondition.CONTAINS;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchTextFilter("hello world", "foo", TextFilterCondition.DOES_NOT_CONTAIN, false)', () => {
			// Arrange
			const propertyValue = "hello world";
			const compare = "foo";
			const condition = TextFilterCondition.DOES_NOT_CONTAIN;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchTextFilter("hello world", "hello", TextFilterCondition.STARTS_WITH, false)', () => {
			// Arrange
			const propertyValue = "hello world";
			const compare = "hello";
			const condition = TextFilterCondition.STARTS_WITH;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchTextFilter("hello world", "world", TextFilterCondition.ENDS_WITH, false)', () => {
			// Arrange
			const propertyValue = "hello world";
			const compare = "world";
			const condition = TextFilterCondition.ENDS_WITH;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchTextFilter("hello", "hello", TextFilterCondition.EXISTS, false)', () => {
			// Arrange
			const propertyValue = "hello";
			const compare = "hello";
			const condition = TextFilterCondition.EXISTS;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});
	});

	describe('Invalid Cases', () => {
		it('should return false for matchTextFilter(null, "hello", TextFilterCondition.IS, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = "hello";
			const condition = TextFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});

		it('should return false for matchTextFilter(null, "world", TextFilterCondition.IS_NOT, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = "world";
			const condition = TextFilterCondition.IS_NOT;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});
	});

	describe('Edge Cases', () => {
		it('should return false for matchTextFilter(null, "hello", TextFilterCondition.EXISTS, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = "hello";
			const condition = TextFilterCondition.EXISTS;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});

		it('should return true for matchTextFilter(null, "world", TextFilterCondition.DOES_NOT_EXIST, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = "world";
			const condition = TextFilterCondition.DOES_NOT_EXIST;
			const matchIfNull = false;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchTextFilter(null, "hello", TextFilterCondition.IS, true)', () => {
			// Arrange
			const propertyValue = null;
			const compare = "hello";
			const condition = TextFilterCondition.IS;
			const matchIfNull = true;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchTextFilter(null, "world", TextFilterCondition.IS_NOT, true)', () => {
			// Arrange
			const propertyValue = null;
			const compare = "world";
			const condition = TextFilterCondition.IS_NOT;
			const matchIfNull = true;

			// Act
			const result = matchTextFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});
	});

	describe('Error Cases', () => {
		it('should throw an error for matchTextFilter("hello", "hello", "unsupported-condition", false)', () => {
			// Arrange
			const propertyValue = "hello";
			const compare = "hello";
			const condition = 'unsupported-condition' as TextFilterCondition;
			const matchIfNull = false;

			// Act & Assert
			expect(() => matchTextFilter(propertyValue, compare, condition, matchIfNull)).toThrow();
		});
	});
});
