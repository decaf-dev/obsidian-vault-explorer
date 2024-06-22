import { matchNumberPropertyFilter } from "src/svelte/app/services/filters/custom/match-number-property-filter";
import { NumberFilterCondition } from "src/types";

describe('matchNumberPropertyFilter', () => {

	describe('Normal Cases', () => {
		it('should return true for IS_EQUAL when values are equal', () => {
			// Arrange
			const propertyValue = 5;
			const compare = 5;
			const condition = NumberFilterCondition.IS_EQUAL;
			const matchIfNull = false;

			// Act
			const result = matchNumberPropertyFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for IS_GREATER when propertyValue is greater than compare', () => {
			// Arrange
			const propertyValue = 10;
			const compare = 5;
			const condition = NumberFilterCondition.IS_GREATER;
			const matchIfNull = false;

			// Act
			const result = matchNumberPropertyFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for IS_LESS when propertyValue is less than compare', () => {
			// Arrange
			const propertyValue = 3;
			const compare = 5;
			const condition = NumberFilterCondition.IS_LESS;
			const matchIfNull = false;

			// Act
			const result = matchNumberPropertyFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for IS_GREATER_OR_EQUAL when propertyValue is equal to compare', () => {
			// Arrange
			const propertyValue = 5;
			const compare = 5;
			const condition = NumberFilterCondition.IS_GREATER_OR_EQUAL;
			const matchIfNull = false;

			// Act
			const result = matchNumberPropertyFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for IS_LESS_OR_EQUAL when propertyValue is less than compare', () => {
			// Arrange
			const propertyValue = 4;
			const compare = 5;
			const condition = NumberFilterCondition.IS_LESS_OR_EQUAL;
			const matchIfNull = false;

			// Act
			const result = matchNumberPropertyFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for IS_NOT_EQUAL when propertyValue is not equal to compare', () => {
			// Arrange
			const propertyValue = 6;
			const compare = 5;
			const condition = NumberFilterCondition.IS_NOT_EQUAL;
			const matchIfNull = false;

			// Act
			const result = matchNumberPropertyFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});
	});

	describe('Edge Cases', () => {
		it('should return true for IS_EQUAL when propertyValue is null and matchIfNull is true', () => {
			// Arrange
			const propertyValue = null;
			const compare = 5;
			const condition = NumberFilterCondition.IS_EQUAL;
			const matchIfNull = true;

			// Act
			const result = matchNumberPropertyFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return false for IS_EQUAL when propertyValue is null and matchIfNull is false', () => {
			// Arrange
			const propertyValue = null;
			const compare = 5;
			const condition = NumberFilterCondition.IS_EQUAL;
			const matchIfNull = false;

			// Act
			const result = matchNumberPropertyFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});

		it('should return false for EXISTS when propertyValue is null', () => {
			// Arrange
			const propertyValue = null;
			const compare = 5;
			const condition = NumberFilterCondition.EXISTS;
			const matchIfNull = false;

			// Act
			const result = matchNumberPropertyFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});

		it('should return true for DOES_NOT_EXIST when propertyValue is null', () => {
			// Arrange
			const propertyValue = null;
			const compare = 5;
			const condition = NumberFilterCondition.DOES_NOT_EXIST;
			const matchIfNull = false;

			// Act
			const result = matchNumberPropertyFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});
	});

	describe('Error Cases', () => {
		it('should throw an error for unsupported condition', () => {
			// Arrange
			const propertyValue = 5;
			const compare = 5;
			const condition = "unsupported-condition" as NumberFilterCondition;
			const matchIfNull = false;

			// Act & Assert
			expect(() => matchNumberPropertyFilter(propertyValue, compare, condition, matchIfNull)).toThrow(
				`Number filter condition not supported: ${condition}`
			);
		});
	});
});
