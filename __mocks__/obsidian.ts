/**
 * Matches the date format of YYYY-MM-DD
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Matches the date format of YYYY-MM-DD:THH:mm
 */
const DATE_TIME_SHORT_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/**
 * Matches the date format of YYYY-MM-DDTHH:mm:ss
 */
const DATE_TIME_FULL_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

export const moment = jest.fn((date: string, _formats: string[], _strict?: boolean) => {
	const parsedDate = new Date(date);
	const mockMoment: unknown = {
		isValid: jest.fn(() => DATE_REGEX.test(date) || DATE_TIME_SHORT_REGEX.test(date) || DATE_TIME_FULL_REGEX.test(date)),
		startOf: jest.fn((unit) => {
			if (unit === "day") {
				parsedDate.setUTCHours(0, 0, 0, 0);
			}
			return mockMoment;
		}),
		set: jest.fn(({ hour, minute, second }) => {
			parsedDate.setUTCHours(hour, minute, second);
			return mockMoment;
		}),
		valueOf: jest.fn(() => parsedDate.getTime())
	};
	return mockMoment;
});
