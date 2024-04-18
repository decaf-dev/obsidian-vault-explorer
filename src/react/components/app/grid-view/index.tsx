import Card from "../card";

import { MarkdownFileRenderData } from "../types";

import "./styles.css";

interface Props {
	data: MarkdownFileRenderData[];
}

export default function GridView({ data }: Props) {
	return (
		<div className="vault-explorer-grid-view">
			{data.map((file) => {
				const { name, tags, path, url, source, status } = file;
				return (
					<Card
						key={path}
						name={name}
						path={path}
						url={url}
						tags={tags}
						source={source}
						status={status}
					/>
				);
			})}
			{/* <Virtuoso
					style={{ height: 400 }}
					data={data}
					itemContent={(index, file) => <Card name={file} />}
				/> */}
		</div>
	);
}
