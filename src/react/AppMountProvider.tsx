import { App, WorkspaceLeaf } from "obsidian";

import React from "react";

interface ContextProps {
	app: App;
	leaf: WorkspaceLeaf;
}

const MountContext = React.createContext<ContextProps | null>(null);

export const useAppMount = () => {
	const value = React.useContext(MountContext);
	if (value === null) {
		throw new Error(
			"useAppMount() called without a <AppMountProvider /> in the tree."
		);
	}

	return value;
};

interface Props extends ContextProps {
	children: React.ReactNode;
}

export default function AppMountProvider({ app, leaf, children }: Props) {
	return (
		<MountContext.Provider value={{ app, leaf }}>
			{children}
		</MountContext.Provider>
	);
}
