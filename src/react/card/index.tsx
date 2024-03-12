import Tag from "../tag";

import "./styles.css";

interface Props {
	name: string;
	tags: string[];
}

export default function Card({ name, tags }: Props) {
	return (
		<div className="frontmatter-view-card">
			<div>{name}</div>
			<div className="frontmatter-view-card__tags">
				{tags.map((tag) => (
					<Tag key={tag} name={tag} />
				))}
			</div>
		</div>
	);
}
