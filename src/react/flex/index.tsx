interface Props {
	direction?: "row" | "column" | "row-reverse" | "column-reverse";
	justify?: "flex-start" | "center" | "space-between" | "flex-end";
	align?: "flex-start" | "center" | "flex-end";
	wrap?: "wrap" | "nowrap";
	width?: string;
	height?: string;
	children: React.ReactNode;
}

export default function Flex({
	direction = "row",
	justify = "flex-start",
	align = "flex-start",
	wrap = "wrap",
	width,
	height,
	children,
}: Props) {
	if (width === undefined && direction === "row") {
		width = "100%";
	} else if (height === undefined && direction === "column") {
		height = "100%";
	}
	return (
		<div
			className="frontmatter-view-flex"
			style={{
				display: "flex",
				flexDirection: direction,
				justifyContent: justify,
				alignItems: align,
				flexWrap: wrap,
				width,
				height,
			}}
		>
			{children}
		</div>
	);
}
