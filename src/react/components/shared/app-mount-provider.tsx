import { App } from "obsidian";

import React from "react";
import { getCurrentSettings, onSettingsChange } from "src/types";

interface ContextProps {
	app: App;
	getCurrentSettings: getCurrentSettings;
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
	getCurrentSettings,
	children,
}: Props) {
	return (
		<MountContext.Provider
			value={{ app, onSettingsChange, getCurrentSettings }}
		>
			{children}
		</MountContext.Provider>
	);
}
