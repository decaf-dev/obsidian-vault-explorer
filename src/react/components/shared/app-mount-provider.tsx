import { App } from "obsidian";

import React from "react";
import { onSettingsChange } from "src/types";

interface ContextProps {
	app: App;
	onSettingsChange: onSettingsChange;
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

export default function AppMountProvider({
	app,
	onSettingsChange,
	children,
}: Props) {
	return (
		<MountContext.Provider value={{ app, onSettingsChange }}>
			{children}
		</MountContext.Provider>
	);
}
