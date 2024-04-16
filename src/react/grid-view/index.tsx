import Card from "../card";

import { MarkdownFileData } from "../types";

import "./styles.css";

interface Props {
	data: MarkdownFileData[];
}

export default function GridView({ data }: Props) {
	return (
		<div className="vault-explorer-grid-view">
			{data.map((file) => {
				const { name, tags, path, url, source, revision, status } =
					file;
				return (
					<Card
						key={path}
						name={name}
						path={path}
						url={url}
						tags={tags}
						source={source}
						revision={revision}
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
