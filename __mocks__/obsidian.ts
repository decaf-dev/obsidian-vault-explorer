/**
 * Matches the date format of YYYY-MM-DD
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Matches the date format of YYYY-MM-DDTHH:MM:SS
 */
const DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

export const moment = jest.fn((date: string, _formats: string[], _strict?: boolean) => {
	return {
		isValid: jest.fn(() => DATE_REGEX.test(date) || DATE_TIME_REGEX.test(date)),
	};
});
