import React from "react";

interface Props {
	initialActiveIndex?: number;
	children: React.ReactNode;
}

interface ChildProps {
	index: number;
}

interface TabContext {
	activeIndex: number;
	setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TabContext = React.createContext<TabContext | null>(null);

export const useTabs = () => {
	const context = React.useContext(TabContext);
	if (context === null) {
		throw new Error("useTabs must be used within a TabList");
	}
	return context;
};

export default function TabList({ initialActiveIndex, children }: Props) {
	const [activeIndex, setActiveIndex] = React.useState(
		initialActiveIndex ?? 0
	);

	return (
		<TabContext.Provider
			value={{
				activeIndex,
				setActiveIndex,
			}}
		>
			{React.Children.map(children, (child, index) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child, {
						index,
					} as Partial<ChildProps>);
				}
				return child;
			})}
		</TabContext.Provider>
	);
}
