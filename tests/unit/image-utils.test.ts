import {
	findFirstImageEmbedTarget,
	isImageUrl,
} from "src/svelte/app/services/utils/image-utils";

describe("isImageUrl", () => {
	it("should return false for an empty url", () => {
		//Arrange
		const url = "";

		//Act
		const result = isImageUrl(url);

		//Assert
		expect(result).toEqual(false);
	});

	it("should return false for a url without an extension", () => {
		//Arrange
		const url = "https://example.com/file";

		//Act
		const result = isImageUrl(url);

		//Assert
		expect(result).toEqual(false);
	});

	it("should return false for a url with an invalid extension", () => {
		//Arrange
		const url = "https://example.com/file.txt";

		//Act
		const result = isImageUrl(url);

		//Assert
		expect(result).toEqual(false);
	});

	it("should return true for image URLs", () => {
		//Arrange
		const url = "https://example.com/file.jpg";

		//Act
		const result = isImageUrl(url);

		//Assert
		expect(result).toEqual(true);
	});
});

describe("findFirstImageEmbed", () => {
	it("should return null for content without an image embed", () => {
		//Arrange
		const content = "This is some text";

		//Act
		const result = findFirstImageEmbedTarget(content);

		//Assert
		expect(result).toEqual(null);
	});

	it("should return null for content with an standard embed that is empty", () => {
		//Arrange
		const content = "![[]]";

		//Act
		const result = findFirstImageEmbedTarget(content);

		//Assert
		expect(result).toEqual(null);
	});

	it("should return the link for content with a standard image embed", () => {
		//Arrange
		const content = "![](https://example.com/file.jpg)";

		//Act
		const result = findFirstImageEmbedTarget(content);

		//Assert
		expect(result).toEqual("https://example.com/file.jpg");
	});

	it("should return the link for content with a standard image embed with alt text", () => {
		//Arrange
		const content = "![cover](https://example.com/file.jpg)";

		//Act
		const result = findFirstImageEmbedTarget(content);

		//Assert
		expect(result).toEqual("https://example.com/file.jpg");
	});

	it("should return the link for content with a standard image embed with no extension", () => {
		//Arrange
		const content = "![](https://example.com/file)";

		//Act
		const result = findFirstImageEmbedTarget(content);

		//Assert
		expect(result).toEqual("https://example.com/file");
	});

	it("should return the image embed for content with an Obsidian embed", () => {
		//Arrange
		const content = "![[file.jpg]]";

		//Act
		const result = findFirstImageEmbedTarget(content);

		//Assert
		expect(result).toEqual("file.jpg");
	});

	it("should return the image embed for content with an Obsidian embed with a parameter", () => {
		//Arrange
		const content = "![[file.jpg|200]]";

		//Act
		const result = findFirstImageEmbedTarget(content);

		//Assert
		expect(result).toEqual("file.jpg");
	});
});
