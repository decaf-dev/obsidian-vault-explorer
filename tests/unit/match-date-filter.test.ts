import { matchDateFilter } from "src/svelte/app/services/filters/custom/match-date-filter";
import { DateFilterCondition } from "src/types";

describe("matchDateFilter", () => {

	describe("Normal Cases", () => {
		it("should return true for matchDateFilter(YYYY-MM-DDTHH:mm:ss, YYYY-MM-DD, IS, false)", () => {
			// Arrange
			const propertyValue = "2020-01-01T12:00:00";
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it("should return true for matchDateFilter(YYYY-MM-DDTHH:mm:ss, YYYY-MM-DD, IS_AFTER, false)", () => {
			// Arrange
			const propertyValue = "2020-01-02T12:00:00";
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS_AFTER;
			const matchIfNull = false;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it("should return true for matchDateFilter(YYYY-MM-DDTHH:mm:ss, YYYY-MM-DD, IS_BEFORE, false)", () => {
			// Arrange
			const propertyValue = "2019-12-31T12:00:00";
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS_BEFORE;
			const matchIfNull = false;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it("should return true for matchDateFilter(YYYY-MM-DD, YYYY-MM-DD, IS, false)", () => {
			// Arrange
			const propertyValue = "2020-01-01";
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it("should return true for matchDateFilter(YYYY-MM-DD, YYYY-MM-DD, IS_AFTER, false)", () => {
			// Arrange
			const propertyValue = "2020-01-02";
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS_AFTER;
			const matchIfNull = false;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it("should return true for matchDateFilter(YYYY-MM-DD, YYYY-MM-DD, IS_BEFORE, false)", () => {
			// Arrange
			const propertyValue = "2019-12-31";
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS_BEFORE;
			const matchIfNull = false;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});
	});

	describe("Invalid Cases", () => {
		it("should return true for matchDateFilter(null, YYYY-MM-DD, IS, true)", () => {
			// Arrange
			const propertyValue = null;
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS;
			const matchIfNull = true;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it("should return true for matchDateFilter(null, YYYY-MM-DD, IS_BEFORE, true)", () => {
			// Arrange
			const propertyValue = null;
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS_BEFORE;
			const matchIfNull = true;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it("should return true for matchDateFilter(null, YYYY-MM-DD, IS_AFTER, true)", () => {
			// Arrange
			const propertyValue = null;
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS_AFTER;
			const matchIfNull = true;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});
	});

	describe("Edge Cases", () => {
		it("should return true for matchDateFilter(YYYY-MM-DDTHH:mm:ss, YYYY-MM-DD, IS, false)", () => {
			// Arrange
			const propertyValue = "2020-01-01T00:00:00";
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it("should return false for matchDateFilter(YYYY-MM-DDTHH:mm:ss, YYYY-MM-DD, IS, false)", () => {
			// Arrange
			const propertyValue = "2020-01-01T23:59:59";
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});

		it("should return true for matchDateFilter(YYYY-MM-DDTHH:mm, YYYY-MM-DD, IS, false)", () => {
			// Arrange
			const propertyValue = "2020-01-01T00:00";
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(true);
		});

		it("should return false for matchDateFilter(YYYY-MM-DDTHH:mm, YYYY-MM-DD, IS, false)", () => {
			// Arrange
			const propertyValue = "2020-01-01T23:59";
			const compare = "2020-01-01";
			const condition = DateFilterCondition.IS;
			const matchIfNull = false;

			// Act
			const result = matchDateFilter(propertyValue, compare, condition, matchIfNull);

			// Assert
			expect(result).toEqual(false);
		});
	});

	describe("Error Cases", () => {
		it("should throw an error for matchDateFilter(YYYY-MM-DDTHH:mm:ss, YYYY-MM-DD, INVALID_CONDITION, false)", () => {
			// Arrange
			const propertyValue = "2020-01-01T12:00:00";
			const compare = "2020-01-01";
			const condition = "INVALID_CONDITION" as DateFilterCondition;
			const matchIfNull = false;

			// Act & Assert
			expect(() => matchDateFilter(propertyValue, compare, condition, matchIfNull)).toThrow();
		});
	});
});
