interface Props {
	spacing?: "xs" | "sm" | "md" | "lg" | "xl";
	justify?: "flex-start" | "center" | "space-between" | "flex-end";
	align?: "flex-start" | "center" | "flex-end";
	direction?: "row" | "column";
	width?: string;
	height?: string;
	children: React.ReactNode;
}

export default function Stack({
	direction = "row",
	spacing = "md",
	justify,
	align,
	children,
	width,
	height,
}: Props) {
	let spacingPx = 0;
	if (spacing === "xs") {
		spacingPx = 4;
	} else if (spacing === "sm") {
		spacingPx = 8;
	} else if (spacing === "md") {
		spacingPx = 16;
	} else if (spacing === "lg") {
		spacingPx = 24;
	} else if (spacing === "xl") {
		spacingPx = 32;
	}
	return (
		<div
			className="frontmatter-view-stack"
			style={{
				display: "flex",
				flexDirection: direction,
				justifyContent: justify,
				alignItems: align,
				[direction === "row" ? "columnGap" : "rowGap"]: spacingPx,
				width,
				height,
			}}
		>
			{children}
		</div>
	);
}
