import { useAppMount } from "../app-mount-provider";
import "./styles.css";

interface Props {
	name: string;
}

export default function Tag({ name }: Props) {
	const { app } = useAppMount();

	function handleClick() {
		const searchPlugin = (app as any).internalPlugins.plugins[
			"global-search"
		];
		if (searchPlugin) {
			searchPlugin.instance.openGlobalSearch(`tag:#${name}`);
		}
	}

	return (
		<a
			className="tag frontmatter-view-tag "
			href={`#${name}`}
			target="_blank"
			rel="noopener"
			onClick={handleClick}
		>
			#{name}
		</a>
	);
}
