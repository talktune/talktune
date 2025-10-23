import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BtnBack from "../common/BtnBack";
import useSelectedStrings from "@/constants/strings";
import LoaderLite from "../common/LoaderLite";

interface InterviewReloadProps {
    reDirectToHome: () => void;
    isSocketTimeoutLoad: boolean;
}

function InterviewReload({ reDirectToHome, isSocketTimeoutLoad }: Readonly<InterviewReloadProps>) {
    const router = useRouter();
    const selectedStrings = useSelectedStrings();
    const goBack = () => {
        router.back();
    };
    return (
        <div>
            <BtnBack goBack={goBack} />
            <div className="flex flex-col items-center justify-center h-[84vh] w-screen">
                <div className="mb-4">
                    <Image
                        src={"/assets/icons/error.png"}
                        alt={"error.png"}
                        width={100}
                        height={100}
                    />
                </div>
                <h1 className="text-2xl">
                    <b>{selectedStrings.textMeetErrorTitle}</b>
                </h1>
                {isSocketTimeoutLoad ? (
                    <>
                        {" "}
                        <p className="text-center py-4">
                            {selectedStrings.textMeetErrorLoading1}
                            <br />
                            {selectedStrings.textMeetErrorLoading2}
                        </p>
                        <div className="flex justify-center">
                            <button
                                className={`mt-4 px-4 py-2 bg-secondaryButtonBg dark:bg-secondaryButtonBg hover:bg-secondaryButtonHover dark:hover:bg-secondaryButtonHover text-whiteText dark:text-whiteTextDark rounded`}
                                onClick={reDirectToHome}
                            >
                                {selectedStrings.textTryAgain}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-center py-4">
                            {selectedStrings.textMeetErrorDescription}
                        </p>

                        <div className="py-4">
                            <LoaderLite />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default InterviewReload;
