import { moment } from "obsidian";

export const formatAsBearTimeString = (milliseconds: number) => {
	const now = moment();
	const time = moment(milliseconds);

	const diffInSeconds = now.diff(time, "seconds");
	const diffInMinutes = now.diff(time, "minutes");
	const diffInHours = now.diff(time, "hours");
	const diffInDays = now.diff(time, "days");

	if (diffInSeconds < 60) {
		return "Just now";
	}
	if (diffInMinutes < 60) {
		return `${diffInMinutes} minutes ago`;
	}
	if (diffInHours < 24) {
		return `${diffInHours} hours ago`;
	}
	if (diffInDays === 1) {
		return `Yesterday at ${time.format("hh:mm A")}`;
	}
	if (time.year() === now.year()) {
		return time.format("MMMM D");
	}
	return time.format("MMMM D, YYYY");
};
