"use client";

import React, { useState, useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import Image from "next/image";
import useSelectedColors from "@/styles/colors";
import {
    meetDoughnutDatasets,
    meetChartOptions,
} from "@/hooks/MeetCountdownsData";

interface CountdownTimerProps {
    isCountdownReset: React.MutableRefObject<boolean>;
    isStartAnswering: React.MutableRefObject<boolean>;
    sendInterimAnswer: (
        data: string,
        isIncrementCount: boolean,
        requestType: "onGoing" | "notAnswered" | "end" | "interrupted"
    ) => void;
    isQuizRefresh: React.MutableRefObject<boolean>;
    sendAnswerResponse: (
        {
            data,
            answerGivenTime,
            questionAskTime,
        }: {
            data: string,
            answerGivenTime: number,
            questionAskTime: number,
            question: string
        }
    ) => void;
    currentToken: React.MutableRefObject<string>;
    questionAskTime: React.MutableRefObject<number>;
    answerGivenTime: React.MutableRefObject<number>;
    isOnProfilePicLoader: React.MutableRefObject<boolean>;
    currentQuestionRef: React.MutableRefObject<string>;
    setCurrentQuestion: (arg: string) => void;
    currentPreparationTime: React.MutableRefObject<number>;
    currentQuestionTime: React.MutableRefObject<number>;
    handleContinueCall: () => void;
    interviewerProfilePic: string;
    isSendingAnswerResponse: React.MutableRefObject<boolean>;
    isTimeLimited: React.MutableRefObject<boolean>;
    setStartTimerStatus: (arg: string) => void;
    startTimerStatus: string;
    isPaused: React.MutableRefObject<boolean>;
}

function CountdownTimer({
    isCountdownReset,
    isStartAnswering,
    sendInterimAnswer,
    isQuizRefresh,
    sendAnswerResponse,
    currentToken,
    questionAskTime,
    answerGivenTime,
    isOnProfilePicLoader,
    currentQuestionRef,
    setCurrentQuestion,
    currentPreparationTime,
    currentQuestionTime,
    handleContinueCall,
    interviewerProfilePic,
    isSendingAnswerResponse,
    isTimeLimited,
    setStartTimerStatus,
    startTimerStatus,
    isPaused,
}: Readonly<CountdownTimerProps>) {
    const interval = useRef<any>(null);
    const countDown = useRef(0);
    const [countdown, setCountdown] = useState(0);
    const selectedColors = useSelectedColors();
    const noneResponseTime = useRef(0);
    const totalTime = useRef(0);
    const count = useRef(3);

    // const [count, setCount] = useState(time);
    const [initialCountDown, setInitialCountDown] = useState(3);
    const playBeep = () => {
        const audio = new Audio("/sounds/beep.mp3");
        audio.play();
    };

    useEffect(() => {
        if (startTimerStatus == "BEGIN") {
            const loadingInterval = setInterval(() => {
                if (count.current > 1) {
                    count.current = count.current - 1;
                    setInitialCountDown(count.current);
                    // setCount((prev) => prev - 1);
                } else {
                    clearInterval(loadingInterval);
                    setStartTimerStatus("END");
                }
            }, 1000);

            // Clear interval on component unmount
            return () => clearInterval(loadingInterval);
        }
    }, [startTimerStatus]);

    // Use useEffect to update the time when quizTimeLimit changes
    useEffect(() => {
        if (isTimeLimited.current == false) {
            if (isCountdownReset.current == true) {
                clearInterval(interval.current);

                countDown.current = 20;

                interval.current = setInterval(() => {
                    if (isStartAnswering.current == true) {
                        clearInterval(interval.current);
                    }

                    if (countDown.current > 0) {
                        isCountdownReset.current = false;

                        if (isPaused.current == false) {
                            countDown.current = countDown.current - 1;
                        }
                    } else if (
                        countDown.current == 0 &&
                        isStartAnswering.current == false
                    ) {
                        sendInterimAnswer("", false, "notAnswered");
                        sendAnswerResponse(
                            {
                                data: "",
                                answerGivenTime: answerGivenTime.current,
                                questionAskTime: questionAskTime.current,
                                question: currentQuestionRef.current,
                            }
                        );
                        isOnProfilePicLoader.current = true;
                        setCurrentQuestion("");
                        isQuizRefresh.current = true;
                        clearInterval(interval.current);
                    } else {
                        clearInterval(interval.current);
                    }
                }, 1000);
            }
        }
    }, [isCountdownReset.current]);

    useEffect(() => {
        if (isTimeLimited.current == true) {
            if (isCountdownReset.current == true) {
                clearInterval(interval.current);

                isCountdownReset.current = false;

                if (currentPreparationTime.current > 0) {
                    countDown.current = currentPreparationTime.current;
                    totalTime.current = currentPreparationTime.current;
                } else {
                    countDown.current = currentQuestionTime.current;
                    totalTime.current = currentQuestionTime.current;
                    noneResponseTime.current = currentQuestionTime.current - 20;
                    handleContinueCall();
                    playBeep();
                }

                interval.current = setInterval(() => {
                    if (isSendingAnswerResponse.current) {
                        isSendingAnswerResponse.current = false;
                        clearInterval(interval.current);
                        return;
                    }

                    if (countDown.current > 0) {
                        if (
                            countDown.current == noneResponseTime.current &&
                            isStartAnswering.current == false &&
                            currentPreparationTime.current == 0
                        ) {
                            sendInterimAnswer("", false, "notAnswered");
                            sendAnswerResponse(
                                {
                                    data: "",
                                    answerGivenTime: answerGivenTime.current,
                                    questionAskTime: questionAskTime.current,
                                    question: currentQuestionRef.current
                                }
                            );
                            isOnProfilePicLoader.current = true;
                            setCurrentQuestion("");
                            isQuizRefresh.current = true;
                            clearInterval(interval.current);
                        } else {
                            if (isPaused.current == false) {
                                countDown.current = countDown.current - 1;
                                setCountdown(countDown.current);
                            }
                        }
                    } else if (countDown.current == 0) {
                        if (currentPreparationTime.current > 0) {
                            handleContinueCall();
                            playBeep();
                            countDown.current = currentQuestionTime.current;
                            totalTime.current = currentQuestionTime.current;
                            noneResponseTime.current = currentQuestionTime.current - 20;
                            currentPreparationTime.current = 0;
                        } else {
                            sendInterimAnswer("", false, "interrupted");
                            sendAnswerResponse(
                                {
                                    data: "",
                                    answerGivenTime: answerGivenTime.current,
                                    questionAskTime: questionAskTime.current,
                                    question: currentQuestionRef.current
                                }
                            );
                            isOnProfilePicLoader.current = true;
                            setCurrentQuestion("");
                            isQuizRefresh.current = true;
                            currentPreparationTime.current = 0;
                            clearInterval(interval.current);
                        }
                    } else {
                        clearInterval(interval.current);
                    }
                }, 1000);
            }
        }
    }, [isCountdownReset.current]);

    const keyframesStyle = `
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

    const loaderStyle: React.CSSProperties = {
        border: `0.5vw solid ${selectedColors.gray}`,
        borderTop: `0.5vw solid ${selectedColors.loaderWhite}`,
        borderRadius: "50%",
        width: `${window.innerWidth <= 1279 ? "27vw" : "17vw"}`,
        height: `${window.innerWidth <= 1279 ? "27vw" : "17vw"}`,
        animation: "spin 1s linear infinite",
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds =
            remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        if (seconds < 60) {
            return `${formattedMinutes}:${formattedSeconds} seconds`;
        }
        return `${formattedMinutes}:${formattedSeconds} min`;
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-col justify-center items-center">
                <div className="h-[26.974vw] w-[26.974vw] xl:h-[18vw] xl:w-[18vw]">
                    {!isOnProfilePicLoader.current && (
                        <>
                            {" "}
                            <Doughnut
                                data={meetDoughnutDatasets(
                                    100 - (countdown / totalTime.current) * 100
                                )}
                                options={meetChartOptions(30)}
                                width={150}
                                height={150}
                                className=" "
                            />
                        </>
                    )}
                </div>
                {isOnProfilePicLoader.current && (
                    <>
                        {" "}
                        <div className="absolute">
                            <style>{keyframesStyle}</style>
                            <div className="loader " style={loaderStyle}></div>
                        </div>
                    </>
                )}

                <div className="absolute">
                    {startTimerStatus === "END" ? (
                        <Image
                            src={`/assets/interviewerProPic/${interviewerProfilePic}`}
                            width={300}
                            height={300}
                            alt="videoSectionleft design"
                            className=" h-[24.895vw] w-[24.895vw] xl:h-[15vw] xl:w-[15vw] rounded-full"
                        />
                    ) : (
                        <div className="relative">
                            <div
                                className={`h-[26.974vw] w-[26.974vw] bg-transparent rounded-full flex items-center justify-center`}
                            >
                                <span
                                    className={`animate-pingCustom text-black dark:text-white text-[10vw] font-bold`}
                                >
                                    {initialCountDown}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-[1vh] h-[1vh]">
                <p
                    className={`m-0  text-center text-[0.75rem] md:text-[0.99rem] lg:text-[1.29rem] font-medium text-labelText dark:text-labelTextDark  `}
                >
                    {!isOnProfilePicLoader.current && isTimeLimited.current && (
                        <>
                            {currentPreparationTime.current != 0 && "Preparation Time: "}{" "}
                            {formatTime(countdown)}
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

export default CountdownTimer;