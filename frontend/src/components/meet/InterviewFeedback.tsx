import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import useSelectedColors from "@/styles/colors";
import Confetti from "react-confetti";

interface InterviewFeedbackProps {
    reDirectToHome: () => void;
    isCancelledInterview: boolean;
}

function InterviewFeedback({ reDirectToHome, isCancelledInterview }: InterviewFeedbackProps) {
    const [countdown, setCountdown] = useState(6);
    const selectedColors = useSelectedColors();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1500);

        return () => clearInterval(timer);
    }, []);

    const greenPercentage = (6 - countdown) * 20;

    useEffect(() => {
        if (countdown === 0) {
            reDirectToHome();
        }
    }, [countdown, reDirectToHome]);

    const chartData = {
        datasets: [
            {
                data: [100 - greenPercentage, greenPercentage],
                backgroundColor: [`${selectedColors.green}`, "transparent"],
                hoverBackgroundColor: [
                    `${selectedColors.green}`,
                    `${selectedColors.green}`,
                ],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: 60,
    };

    return (
        <>
            {!isCancelledInterview && <Confetti />}

            <div className="flex flex-col items-center justify-center h-auto mx-[10vw] md:mx-0">
                <div className="w-full md:w-[28rem] lg:w-[43rem] shadow-lg dark:border-grayBorderDark bg-secondaryBg dark:bg-secondaryBgDark flex flex-col">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="text-center">
                            {isCancelledInterview ? (
                                <>
                                    {" "}
                                    <h2 className="text-xl font-bold">
                                        The interview has been canceled.
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        You have canceled the interview.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold">Processing Evaluation</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        We&apos;ll notify you when it&apos;s ready. In the meantime,
                                        let us know how your feedback.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="relative mt-6">
                        <Doughnut data={chartData} options={chartOptions} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-28 h-28 flex items-center justify-center rounded-full">
                                <span
                                    className={`text-blueText text-center text-xs sm:text-sm`}
                                >
                                    {countdown}
                                    <br />
                                    seconds
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative my-[5vh] lg:my-10 flex flex-col justify-center items-center">
                        <button
                            onClick={() => {
                                reDirectToHome();
                            }}
                            className="border rounded-md border-[#339999] bg-transparent text-[0.8rem] lg:text-[1rem] text-focusRing h-[5vh] w-[8rem] md:w-[10rem] mt-3"
                        >
                            Home
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InterviewFeedback;
