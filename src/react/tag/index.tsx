import "./styles.css";

interface Props {
	name: string;
}

export default function Tag({ name }: Props) {
	return (
		<a
			className="tag frontmatter-view-tag "
			href={`#${name}`}
			target="_blank"
			rel="noopener"
		>
			#{name}
		</a>
	);
}
