import {
	getExternalEmbedTarget,
	getInternalEmbedTarget,
	getWikiLinkTarget,
} from "src/svelte/app/services/link-utils/link-target-getters";

describe("getWikiLinkTarget", () => {
	it("should return null for content without a wiki link", () => {
		//Arrange
		const content = "This is some text";

		//Act
		const result = getWikiLinkTarget(content);

		//Assert
		expect(result).toEqual(null);
	});

	it("should return the target for content with a wiki link", () => {
		//Arrange
		const content = "[[file.jpg]]";

		//Act
		const result = getWikiLinkTarget(content);

		//Assert
		expect(result).toEqual("file.jpg");
	});

	it("should return the target for content with a wiki link with a paremeter", () => {
		//Arrange
		const content = "[[file.jpg|200]]";

		//Act
		const result = getWikiLinkTarget(content);

		//Assert
		expect(result).toEqual("file.jpg");
	});
});

describe("getInternalEmbedTarget", () => {
	it("should return null for content without an internal embed", () => {
		//Arrange
		const content = "This is some text";

		//Act
		const result = getInternalEmbedTarget(content);

		//Assert
		expect(result).toEqual(null);
	});

	it("should return the target for content with an internal embed", () => {
		//Arrange
		const content = "![[file.jpg]]";

		//Act
		const result = getInternalEmbedTarget(content);

		//Assert
		expect(result).toEqual("file.jpg");
	});

	it("should return the target for content with an internal embed with a parameter", () => {
		//Arrange
		const content = "![[file.jpg|200]]";

		//Act
		const result = getInternalEmbedTarget(content);

		//Assert
		expect(result).toEqual("file.jpg");
	});
});

describe("getExternalImageEmbedTarget", () => {
	it("should return null for content without a link", () => {
		//Arrange
		const content = "This is some text";

		//Act
		const result = getExternalEmbedTarget(content);

		//Assert
		expect(result).toEqual(null);
	});

	it("should return null for content with a link that is not an external embed", () => {
		//Arrange
		const content = "[[file.txt]]";

		//Act
		const result = getExternalEmbedTarget(content);

		//Assert
		expect(result).toEqual(null);
	});

	it("should return the target for content with an external image embed", () => {
		//Arrange
		const content = "![cover](https://example.com/file.jpg)";

		//Act
		const result = getExternalEmbedTarget(content);

		//Assert
		expect(result).toEqual("https://example.com/file.jpg");
	});

	it("should return the target for content with an external image embed with an empty alt tag", () => {
		//Arrange
		const content = "![](https://example.com/file.jpg)";

		//Act
		const result = getExternalEmbedTarget(content);

		//Assert
		expect(result).toEqual("https://example.com/file.jpg");
	});
});
