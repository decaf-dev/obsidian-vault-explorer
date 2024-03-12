interface Props {
	name: string;
}

export default function Tag({ name }: Props) {
	return (
		<a href={`#${name}`} className="tag" target="_blank" rel="noopener">
			#{name}
		</a>
	);
}
