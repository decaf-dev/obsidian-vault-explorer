const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

export const moment = jest.fn((date, formats, strict) => {
	return {
		isValid: jest.fn(() => DATE_REGEX.test(date) || DATE_TIME_REGEX.test(date)),
	};
});
