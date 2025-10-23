"use client";

import React, { useEffect } from "react";
import Image from "next/image";

function LoaderHeader() {

    return (
        <header className={`p-6 flex items-center justify-between`}>
            <Image
                src={
                    "/assets/icons/headerLogo.svg"
                }
                width={140}
                height={50}
                alt="TalkTune logo"
            />
        </header>
    );
}

export default LoaderHeader;
