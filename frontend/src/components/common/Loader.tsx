"use client";

import { useState, useEffect } from "react";
import LoaderHeader from "./LoaderHeader";
import useSelectedStrings from "@/constants/strings";

function Loader() {
    const [loaderTextIndex, setLoaderTextIndex] = useState(0);
    const selectedStrings = useSelectedStrings();
    const loaderTexts = selectedStrings.loaderTexts;

    useEffect(() => {
        const lines = document.querySelectorAll(".line-animation");
        const animationDuration = 1.5;

        lines.forEach((line, index) => {
            const randomDelay = Math.random() * animationDuration;
            const lineElement = line as HTMLElement;
            lineElement.style.animationDelay = `${randomDelay}s`;
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setLoaderTextIndex((prevIndex) =>
                prevIndex === loaderTexts.length - 1 ? 0 : prevIndex + 1
            );
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className={`bg-primaryBg dark:bg-primaryBgDark text-labelText dark:text-labelTextDark h-[100vh]`}
        >
            <LoaderHeader />
            <div
                className={`flex flex-col items-center justify-center h-[84vh] w-screen`}
            >
                <div className="h-10 flex gap-1.5 justify-center">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="h-10 w-1.5 bg-black dark:bg-white line-animation"
                        ></div>
                    ))}
                </div>
                <div className="mt-16">
                    <p className="mr-9 ml-9 text-center">
                        {loaderTexts[loaderTextIndex]}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Loader;
