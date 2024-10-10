export const isVersionLessThan = (oldVersion: string, newVersion: string) => {
	const oldVersionArray = oldVersion.split(".");
	const newVersionArray = newVersion.split(".");

	for (let i = 0; i < oldVersionArray.length; i++) {
		const oldVersionNumber = parseInt(oldVersionArray[i]);
		const newVersionNumber = parseInt(newVersionArray[i]);

		if (oldVersionNumber < newVersionNumber) {
			return true;
		}

		if (oldVersionNumber > newVersionNumber) {
			return false;
		}
	}

	return false;
};

export const parseStringToObject = (input: string): Record<string, string> => {
	const lines = input.split("\n");
	let obj: Record<string, string> = {};

	const regex = /(\w+):\s*(\w+)/;

	for (const line of lines) {
		const match = line.match(regex);
		if (match) {
			obj[match[1]] = match[2];
		}
	}

	return obj;
};
