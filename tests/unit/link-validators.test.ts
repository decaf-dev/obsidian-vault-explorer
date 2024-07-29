import {
	isExternalEmbed,
	isInternalEmbed,
	isWikiLink,
} from "src/svelte/app/services/link-utils/link-validators";

describe("isWikiLink", () => {
	it("should return false for content without a wiki link", () => {
		//Arrange
		const content = "This is some text";

		//Act
		const result = isWikiLink(content);

		//Assert
		expect(result).toEqual(false);
	});

	it("should return true for content with a wiki link", () => {
		//Arrange
		const content = "[[file.jpg]]";

		//Act
		const result = isWikiLink(content);

		//Assert
		expect(result).toEqual(true);
	});

	it("should return true for content with a wiki link with a paremeter", () => {
		//Arrange
		const content = "[[file.jpg|200]]";

		//Act
		const result = isWikiLink(content);

		//Assert
		expect(result).toEqual(true);
	});
});

describe("isInternalEmbed", () => {
	it("should return false for content without an internal embed", () => {
		//Arrange
		const content = "This is some text";

		//Act
		const result = isInternalEmbed(content);

		//Assert
		expect(result).toEqual(false);
	});

	it("should return true for content with an internal embed", () => {
		//Arrange
		const content = "![[file.jpg]]";

		//Act
		const result = isInternalEmbed(content);

		//Assert
		expect(result).toEqual(true);
	});

	it("should return true for content with an internal embed with a parameter", () => {
		//Arrange
		const content = "![[file.jpg|200]]";

		//Act
		const result = isInternalEmbed(content);

		//Assert
		expect(result).toEqual(true);
	});
});

describe("isExternalEmbed", () => {
	it("should return false for content without an external image embed", () => {
		//Arrange
		const content = "This is some text";

		//Act
		const result = isExternalEmbed(content);

		//Assert
		expect(result).toEqual(false);
	});

	it("should return true for content with an external image embed", () => {
		//Arrange
		const content = "![cover](https://example.com/file.jpg)";

		//Act
		const result = isExternalEmbed(content);

		//Assert
		expect(result).toEqual(true);
	});

	it("should return true for content with an external image embed with no alt text", () => {
		//Arrange
		const content = "![](https://example.com/file.jpg)";

		//Act
		const result = isExternalEmbed(content);

		//Assert
		expect(result).toEqual(true);
	});
});
