"use client";

import React, { useState, useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { ChartOptions, DoughnutDatasets } from "../common/DoughnutDatasets";

Chart.register(ArcElement);

function formatTime(seconds: number) {
    if (seconds >= 3600) {
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;
        if (seconds > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${hours}h`;
        }
    } else if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;
        if (seconds > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${minutes}m`;
        }
    } else {
        return `${seconds}s`;
    }
}

interface InterviewTimerProps {
    isInterviewTimeout: React.MutableRefObject<boolean>;
    selectedStrings: { textTimeLeft: string };
    interviewTimeLimit: string;
    category: string;
    isPaused: React.MutableRefObject<boolean>;
}

function InterviewTimer({
    isInterviewTimeout,
    selectedStrings,
    interviewTimeLimit,
    category,
    isPaused,
}: Readonly<InterviewTimerProps>) {
    const [totalTime, setTotalTime] = useState(0);
    const [timerCount, setTimerCount] = useState(totalTime);
    const currentTime = useRef(0);
    const interval = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (interviewTimeLimit != "" && category != "examinationCenter") {
            const timeInMin = parseInt(interviewTimeLimit);
            const timeInSec = timeInMin * 60;
            setTotalTime(timeInSec);

            if (timeInSec > 0) {
                currentTime.current = timeInSec;
                clearInterval(interval.current!);
                interval.current = setInterval(() => {
                    if (!isPaused.current && currentTime.current > 0) {
                        currentTime.current = currentTime.current - 1;
                        setTimerCount(currentTime.current);
                        if (currentTime.current == 0) {
                            isInterviewTimeout.current = true;
                            clearInterval(interval.current!);
                            // endInterview();
                        }
                    }
                }, 1000);
            }
        }
    }, [interviewTimeLimit, category, isInterviewTimeout, isPaused]);
    return (
        <>
            {interviewTimeLimit != "" && (
                <div className="absolute right-4 md:right-10 ">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative h-20 w-20 sm:w-32 sm:h-32">
                            <Doughnut
                                data={DoughnutDatasets({
                                    overall_score: (timerCount / totalTime) * 100,
                                })}
                                options={ChartOptions(30)}
                                width={150}
                                height={150}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 flex flex-col items-center justify-center bg-grayBg dark:bg-secondaryBgDark rounded-full">
                                    <div className="text-labelText dark:text-labelTextDark text-[0.4em] sm:text-base font-bold">
                                        {formatTime(timerCount)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-16 text-[0.4em] sm:text-sm text-labelText dark:text-labelTextDark text-center">
                            {selectedStrings.textTimeLeft}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default InterviewTimer;
