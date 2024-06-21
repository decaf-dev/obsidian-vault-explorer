import { matchCheckboxFilter } from "src/svelte/app/services/filters/custom/match-checkbox-filter";
import { CheckboxFilterCondition } from "src/types";

describe('matchCheckboxFilter', () => {

	describe('Normal Cases', () => {
		it('should return true for matchCheckboxFilter(true, true, CheckboxFilterCondition.IS, false)', () => {
			// Arrange
			const propertyValue = true;
			const compare = true;
			const condition = CheckboxFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchCheckboxFilter(false, false, CheckboxFilterCondition.IS, false)', () => {
			// Arrange
			const propertyValue = false;
			const compare = false;
			const condition = CheckboxFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchCheckboxFilter(true, false, CheckboxFilterCondition.IS_NOT, false)', () => {
			// Arrange
			const propertyValue = true;
			const compare = false;
			const condition = CheckboxFilterCondition.IS_NOT;
			const matchIfNull = false;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchCheckboxFilter(false, true, CheckboxFilterCondition.IS_NOT, false)', () => {
			// Arrange
			const propertyValue = false;
			const compare = true;
			const condition = CheckboxFilterCondition.IS_NOT;
			const matchIfNull = false;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchCheckboxFilter(true, true, CheckboxFilterCondition.EXISTS, false)', () => {
			// Arrange
			const propertyValue = true;
			const compare = true;
			const condition = CheckboxFilterCondition.EXISTS;
			const matchIfNull = false;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchCheckboxFilter(false, true, CheckboxFilterCondition.EXISTS, false)', () => {
			// Arrange
			const propertyValue = false;
			const compare = true;
			const condition = CheckboxFilterCondition.EXISTS;
			const matchIfNull = false;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});
	});

	describe('Invalid Cases', () => {
		it('should return false for matchCheckboxFilter(null, true, CheckboxFilterCondition.IS, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = true;
			const condition = CheckboxFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});

		it('should return false for matchCheckboxFilter(null, false, CheckboxFilterCondition.IS_NOT, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = false;
			const condition = CheckboxFilterCondition.IS_NOT;
			const matchIfNull = false;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});
	});

	describe('Edge Cases', () => {
		it('should return false for matchCheckboxFilter(null, true, CheckboxFilterCondition.EXISTS, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = true;
			const condition = CheckboxFilterCondition.EXISTS;
			const matchIfNull = false;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});

		it('should return true for matchCheckboxFilter(null, true, CheckboxFilterCondition.DOES_NOT_EXIST, false)', () => {
			// Arrange
			const propertyValue = null;
			const compare = true;
			const condition = CheckboxFilterCondition.DOES_NOT_EXIST;
			const matchIfNull = false;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchCheckboxFilter(null, true, CheckboxFilterCondition.IS, true)', () => {
			// Arrange
			const propertyValue = null;
			const compare = true;
			const condition = CheckboxFilterCondition.IS;
			const matchIfNull = true;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it('should return true for matchCheckboxFilter(null, false, CheckboxFilterCondition.IS_NOT, true)', () => {
			// Arrange
			const propertyValue = null;
			const compare = false;
			const condition = CheckboxFilterCondition.IS_NOT;
			const matchIfNull = true;

			// Act
			const result = matchCheckboxFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});
	});

	describe('Error Cases', () => {
		it('should throw an error for matchCheckboxFilter(true, true, "unsupported-condition", false)', () => {
			// Arrange
			const propertyValue = true;
			const compare = true;
			const condition = "unsupported-condition" as CheckboxFilterCondition;
			const matchIfNull = false;

			// Act & Assert
			expect(() => matchCheckboxFilter(propertyValue, compare, condition, matchIfNull)).toThrow();
		});
	});
});
