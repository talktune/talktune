"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type DashboardHeaderProps = {
    title: string;
    isDisplayProfile: boolean;
};

function DashboardHeader({ isDisplayProfile }: DashboardHeaderProps) {
    const [isDropDownActive, setIsDropDownActive] = useState(false);
    const [isStarDropDownActive, setIsStarDropDownActive] = useState(false);

    const modalRef = useRef<HTMLDivElement | null>(null);

    const handleProfileClick = () => {
        setIsDropDownActive(!isDropDownActive);
        setIsStarDropDownActive(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node) &&
            isDisplayProfile
        ) {
            setIsDropDownActive(false);
            setIsStarDropDownActive(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handlePaymentModal = () => {
        // Implementation for payment modal
    };

    return (
        <div>
            <div
                className="flex flex-col bg-white dark:bg-primaryBgDark border-b-[0.052vw] border-grayBgLow2 dark:border-primaryBgDark pl-2 sm:pl-6 pr-12 min-w-[360px] h-[4.507rem] justify-center"
                onClick={(e) => handleClickOutside(e as unknown as MouseEvent)}
            >
                <div className="flex justify-between items-center">
                    <div>
                        <div className="absolute left-[2.201vw] top-[1.52rem] flex items-center h-[2.044rem] w-[11.897rem]">
                            <Link href={"/"}>
                                <Image
                                    src={"/assets/icons/headerLogo.svg"}
                                    width={160}
                                    height={60}
                                    alt="TalkTune logo"
                                />
                            </Link>
                        </div>
                    </div>
                    <div
                        className={`absolute sm:right-[15.042rem] right-[5.542rem] flex items-center rounded-full text-blueTextHover dark:text-blueTextHoverDark hover:bg-bgHover dark:hover:bg-bgHoverDark transition duration-300`}
                        onClick={handlePaymentModal}
                    >
                        <Image
                            className="w-[1.31rem] h-[1.31rem]"
                            src="/assets/icons/coins.png"
                            alt="Coins"
                            width={18}
                            height={18}
                        />
                        <span
                            className={`text-labelText text-[0.839rem] ml-[1rem] font-bold dark:text-labelTextDark`}
                        >
                            Tokens
                        </span>
                    </div>
                    <div
                        ref={modalRef}
                        className="flex justify-between gap-4 items-center z-50"
                    >
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardHeader;