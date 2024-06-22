
import { FrontMatterCache } from "obsidian";
import { FilterRuleType } from "src/types";
import { loadPropertyValue } from "src/svelte/shared/services/load-property-value";

describe("loadPropertyValue", () => {
	it("returns null if frontmatter is undefined", () => {
		//Arrange
		const frontmatter: FrontMatterCache | undefined = undefined;

		//Act
		const result = loadPropertyValue<string>(frontmatter, "test", FilterRuleType.TEXT);

		//Assert
		expect(result).toBeNull();
	});

	it("returns null if propertyName is empty", () => {
		//Arrange
		const frontmatter: FrontMatterCache = {};
		const propertyName = "";

		//Act
		const result = loadPropertyValue<string>(frontmatter, propertyName, FilterRuleType.TEXT);

		//Assert
		expect(result).toBeNull();
	});

	it("returns null if propertyValue is undefined", () => {
		//Arrange
		const frontmatter: FrontMatterCache = {};
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string>(frontmatter, propertyName, FilterRuleType.TEXT);

		//Assert
		expect(result).toBeNull();
	});

	it("returns null if propertyValue is null", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: null };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string>(frontmatter, propertyName, FilterRuleType.TEXT);

		//Assert
		expect(result).toBeNull();
	});

	it("returns null if expectedType is PropertyType.TEXT and value is not a string", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: 1 };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string>(frontmatter, propertyName, FilterRuleType.TEXT);

		//Assert
		expect(result).toBeNull();
	});

	it("returns propertyValue if expectedType is PropertyType.TEXT and value is a string", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: "test" };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string>(frontmatter, propertyName, FilterRuleType.TEXT);

		//Assert
		expect(result).toBe("test");
	});

	it("returns null if expectedType is PropertyType.NUMBER and value is not a number", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { name: "test" };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<number>(frontmatter, propertyName, FilterRuleType.NUMBER);

		//Assert
		expect(result).toBeNull();
	});

	it("returns propertyValue if expectedType is PropertyType.NUMBER and value is a number", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: 1 };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<number>(frontmatter, propertyName, FilterRuleType.NUMBER);

		//Assert
		expect(result).toBe(1);
	});

	it("returns null if expectedType is PropertyType.CHECKBOX and value is not a boolean", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: "test" };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<boolean>(frontmatter, propertyName, FilterRuleType.CHECKBOX);

		//Assert
		expect(result).toBeNull();
	});

	it("returns propertyValue if expectedType is PropertyType.TEXT and value is a boolean", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: true };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<boolean>(frontmatter, propertyName, FilterRuleType.CHECKBOX);

		//Assert
		expect(result).toBe(true);
	});

	it("returns propertyValue as array if expectedType is PropertyType.LIST and value is an string", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: "test" };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string[]>(frontmatter, propertyName, FilterRuleType.LIST);

		//Assert
		expect(result).toEqual(["test"]);
	});

	it("returns propertyValue if expectedType is PropertyType.LIST and value is an array", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: ["test"] };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string[]>(frontmatter, propertyName, FilterRuleType.LIST);

		//Assert
		expect(result).toEqual(["test"]);
	});


	it("returns propertyValue without null values if expectedType is PropertyType.LIST and value is an array", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: ["test", null] };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string[]>(frontmatter, propertyName, FilterRuleType.LIST);

		//Assert
		expect(result).toEqual(["test"]);
	});

	it("returns null if expectedType is PropertyType.DATE and value is not a string", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: 1 };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string>(frontmatter, propertyName, FilterRuleType.DATE);

		//Assert
		expect(result).toBeNull();
	});

	it("returns null if expectedType is PropertyType.DATETIME and value is not a supported format", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: '<% tp.file.creation_date() %>' };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string>(frontmatter, propertyName, FilterRuleType.DATETIME);

		//Assert
		expect(result).toBeNull();
	});


	it("returns propertyValue if expectedType is PropertyType.DATE and value is a string", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: "2021-01-01" };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string>(frontmatter, propertyName, FilterRuleType.DATE);

		//Assert
		expect(result).toBe("2021-01-01");
	});

	it("returns null if expectedType is PropertyType.DATETIME and value is not a string", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: 1 };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string>(frontmatter, propertyName, FilterRuleType.DATETIME);

		//Assert
		expect(result).toBeNull();
	});

	it("returns null if expectedType is PropertyType.DATETIME and value is not a supported format", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: '<% tp.file.last_modified_date("dddd Do MMMM YYYY HH: mm: ss") %>' };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string>(frontmatter, propertyName, FilterRuleType.DATETIME);

		//Assert
		expect(result).toBeNull();
	});

	it("returns propertyValue if expectedType is PropertyType.LIST and value is a string", () => {
		//Arrange
		const frontmatter: FrontMatterCache = { test: "2021-01-01T00:00:00" };
		const propertyName = "test";

		//Act
		const result = loadPropertyValue<string>(frontmatter, propertyName, FilterRuleType.DATETIME);

		//Assert
		expect(result).toBe("2021-01-01T00:00:00");
	});
});
