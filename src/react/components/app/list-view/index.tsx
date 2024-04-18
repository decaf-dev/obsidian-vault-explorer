import ListItem from "../list-item";

import { MarkdownFileData } from "../types";

import "./styles.css";

interface Props {
	data: MarkdownFileData[];
}

export default function ListView({ data }: Props) {
	return (
		<div className="vault-explorer-list-view">
			{data.map((file) => {
				const { name, path } = file;
				return <ListItem key={path} name={name} path={path} />;
			})}
			{/* <Virtuoso
					style={{ height: 400 }}
					data={data}
					itemContent={(index, file) => <Card name={file} />}
				/> */}
		</div>
	);
}
