import React from "react";
import MeetButton from "./MeetButton";
import MeetEndButton from "./MeetEndButton";
import { ImPhoneHangUp } from "react-icons/im";
import { FaPause } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";

interface InterviewStickyFooterProps {
    isMicMuted: boolean;
    isDisplayCC: boolean;
    isPausedInterview: boolean;
    handleMicrophone: () => void;
    handleSubtitle: () => void;
    handleShowPopup: () => void;
    handlePauseInterview: () => void;
}

function InterviewStickyFooter({
    isMicMuted,
    isDisplayCC,
    isPausedInterview,
    handleMicrophone,
    handleSubtitle,
    handleShowPopup,
    handlePauseInterview,
}: InterviewStickyFooterProps) {
    return (
        <div>
            <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-primaryBgDark border-t-[0.052vw] border-grayBgLow2 dark:border-primaryBgDark w-full  p-4">
                <div className=" flex justify-center flex-row gap-[2.014vw]  mt-[1vh]">
                    {" "}
                    <MeetButton
                        click={handleMicrophone}
                        type={"microphone"}
                        isActived={!isMicMuted}
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {isMicMuted ? (
                                    <>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                                        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                                        <line x1="12" y1="19" x2="12" y2="23"></line>
                                        <line x1="8" y1="23" x2="16" y2="23"></line>
                                    </>
                                ) : (
                                    <>
                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                        <line x1="12" y1="19" x2="12" y2="23"></line>
                                        <line x1="8" y1="23" x2="16" y2="23"></line>
                                    </>
                                )}
                            </svg>
                        }
                    />
                    <MeetButton
                        click={handleSubtitle}
                        type={"cc"}
                        isActived={isDisplayCC}
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                                <path d="M7 10.5h2a1.5 1.5 0 0 1 0 3H7"></path>
                                <path d="M14 10.5h3"></path>
                                <path d="M7 15.5h3"></path>
                                <path d="M14 15.5h3"></path>
                            </svg>
                        }
                    />{" "}
                    <MeetButton
                        click={handlePauseInterview}
                        type={"microphone"}
                        isActived={!isPausedInterview}
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {isPausedInterview ? <FaPlay /> : <FaPause />}
                            </svg>
                        }
                    />
                    <MeetEndButton click={handleShowPopup} icon={<ImPhoneHangUp />} />
                </div>
            </footer>
        </div>
    );
}

export default InterviewStickyFooter;