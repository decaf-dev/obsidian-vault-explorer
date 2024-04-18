import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_SETTINGS } from "src/constants";
import { VaultExplorerPluginSettings } from "src/types";

interface GlobalState {
	settings: VaultExplorerPluginSettings;
}

const initialState: GlobalState = {
	settings: DEFAULT_SETTINGS,
};

const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setSettings(state, action: PayloadAction<VaultExplorerPluginSettings>) {
			state.settings = action.payload;
		},
	},
});

export const { setSettings } =
	globalSlice.actions;
export default globalSlice.reducer;
