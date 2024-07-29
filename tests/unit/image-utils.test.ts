import { isImageUrl } from "src/svelte/app/services/utils/image-utils";

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
