import React from "react";

export const useDidMountEffect = (callback: React.EffectCallback, deps: React.DependencyList) => {
	const didMount = React.useRef(false);

	React.useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
			return;
		}
		callback();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
};
