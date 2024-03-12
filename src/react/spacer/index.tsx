interface Props {
	size: "xs" | "sm" | "md" | "lg";
}

export default function Spacer({ size }: Props) {
	let height = 0;
	switch (size) {
		case "xs":
			height = 4;
			break;
		case "sm":
			height = 8;
			break;
		case "md":
			height = 16;
			break;
		case "lg":
			height = 24;
			break;
	}
	return <div style={{ height }}></div>;
}
