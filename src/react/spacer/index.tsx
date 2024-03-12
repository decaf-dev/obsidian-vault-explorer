interface Props {
	direction?: "horizontal" | "vertical";
	size: "xs" | "sm" | "md" | "lg";
}

export default function Spacer({ size, direction = "vertical" }: Props) {
	let width = 0;
	let height = 0;
	switch (size) {
		case "xs":
			width = 4;
			height = 4;
			break;
		case "sm":
			width = 8;
			height = 8;
			break;
		case "md":
			width = 16;
			height = 16;
			break;
		case "lg":
			width = 24;
			height = 24;
			break;
	}

	if (direction === "horizontal") {
		return <div style={{ width, height: 0 }}></div>;
	}
	return <div style={{ height, width: 0 }}></div>;
}
