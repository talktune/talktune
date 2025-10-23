import React from "react";
import SkeletonLines from "@/components/skeletons/SkeletonLines";

interface TabItem {
    icon: string;
    label: string;
    active?: boolean;
}

interface NavigationProp {
    isLoading: boolean;
}

const tabs: TabItem[] = [
    {
        icon: "/assets/icon/briefcase.svg",
        label: "Interview Prep",
    }
];

export const NavigationTabs: React.FC<NavigationProp> = ({
    isLoading,
}) => {
    return (
        <nav
            className={`flex flex-row items-start justify-between tracking-wide leading-tight min-w-[240px] text-black w-full ${isLoading && "gap-10"} `}
        >
            {isLoading ? (
                <SkeletonLines
                    width="w-full"
                    height="h-[30px] sm:h-[45px] sm:mt-[10px]"
                />
            ) : (
                <>
                    {" "}
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`flex w-full gap-1 sm:gap-3 justify-center text-[2.921vw] sm:text-[16px] items-center  border-b-2 border-solid py-[1.215vw] border-b-green-700`}
                        >
                            <img
                                src={tab.icon}
                                alt=""
                                className="object-contain shrink-0 self-stretch  w-[2.856vw] sm:w-[20px] aspect-square"
                            />
                            <span className="self-stretch my-auto">{tab.label}</span>
                        </button>
                    ))}
                </>
            )}
        </nav>
    );
};