import { useAppMount } from "../app-mount-provider";
import "./styles.css";

interface Props {
	name: string;
	value: string;
}

export default function Property({ name, value }: Props) {
	const { app } = useAppMount();

	function handleClick() {
		const searchPlugin = (app as any).internalPlugins.plugins[
			"global-search"
		];
		if (searchPlugin) {
			searchPlugin.instance.openGlobalSearch(`["${name}":${value}`);
		}
	}

	return (
		<a
			// href={`["${source}"]`}
			className="tag frontmatter-view-property"
			target="_blank"
			rel="noopener"
			onClick={handleClick}
		>
			{value}
		</a>
	);
}
