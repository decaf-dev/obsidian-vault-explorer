import { customAlphabet } from "nanoid";

//An alphabet that excludes characters that are easily confused with each other
// Excludes: 0, O, I, l
const nanoid = customAlphabet(
	"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);

/**
 * Generates a random id
 * base58: 58 characters
 * 16 characters: 58^16 = 1.4e+29
 * @returns A random string of length 16
 */
export const generateRandomId = () => {
	return nanoid(16);
};
