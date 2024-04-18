import { writable } from "svelte/store";
import VaultExplorerPlugin from "src/main";

const plugin = writable<VaultExplorerPlugin>();
export default { plugin };
