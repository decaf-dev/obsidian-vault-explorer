import moment from "moment";

export const getMidnightToday = () => {
	const midnightToday = moment().startOf("day").valueOf();
	return midnightToday;
};

export const getMidnightThisWeek = () => {
	const midnightThisWeek = moment().startOf("week").valueOf();
	return midnightThisWeek;
};

export const getMidnightLastWeek = () => {
	//This is the Sunday the previous week
	const midnightLastWeek = moment()
		.subtract(1, "weeks")
		.startOf("week")
		.valueOf();

	return midnightLastWeek;
};

export const getMidnightMillis = (date: string) => {
	const midnight = moment(date).startOf("day").valueOf();
	return midnight;
}

export const getMillis = (date: string) => {
	const time = moment(date).valueOf();
	return time;
}

export const getBeforeMidnightMillis = (date: string) => {
	const day = moment(date);
	day.set({
		hour: 23,
		minute: 59,
		second: 59,
		millisecond: 999
	});
	return day.valueOf();
}
