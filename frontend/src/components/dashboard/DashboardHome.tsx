import { Interview } from "@/interfaces/interview";
import { getInterviews } from "@/lib/queries/interviews";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ArrowButton from "../common/ArrowButton";
import { InterviewCard } from "../meet/InterviewCard";
import { useTheme } from "next-themes";
import SkeletonSearchedCard from "../skeletons/SkeletonSearchCard";
import { NavigationTabs } from "./NavigationTabs";

function DashboardHome() {

    const searchParams = useSearchParams();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [jobInterviews, setJobInterviews] = useState<Interview[]>([]);

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setTheme("light");
    }, [theme, setTheme]);

    useEffect(() => {
        setIsLoading(true);
        getInterviews().then((interviews) => {
            setJobInterviews(interviews);
            setIsLoading(false);
        }).catch((error) => {
            throw error;
        }).finally(() => {
            setIsLoading(false);
        }
        );


    }, []);

    const [visibleInterviews, setVisibleInterviews] = useState(4);

    const handleLoadMore = () => {
        setVisibleInterviews((prev) => prev + 4);
    };

    return (
        <div className="bg-white2 h-screen w-screen">
            <div className="max-w-[1253px] py-[32px] mx-auto    ">

                <main className="flex overflow-hidden flex-col pl-[1.667vw] pr-[2.222vw] pb-24 max-md:pb-24 bg-white2">
                    <header className="flex flex-wrap gap-10 justify-between items-end w-full max-md:max-w-full mb-[40px]">
                        <NavigationTabs
                            isLoading={isLoading}
                        />
                    </header>
                    <section className="flex flex-col w-full bg-white rounded-2xl shadow-[0px_4px_80px_rgba(0,0,0,0.05)] p-[2.222vw]  gap-10">
                        {jobInterviews.length == 0 && !isLoading ? (
                            <div className="flex w-full sm:h-[300px] h-[150px] bg-gray-100 justify-center items-center text-[10px] sm:text-[20px]">
                                <i> No relevant interview prep found.</i>
                            </div>
                        ) : (
                            <>
                                {" "}
                                {isLoading ? (
                                    <SkeletonSearchedCard noOfCard={3} />
                                ) : (
                                    <>
                                        {" "}
                                        {jobInterviews
                                            .slice(0, visibleInterviews)
                                            .map((interview: Interview, index) => (
                                                <InterviewCard
                                                    interviewData={interview}
                                                    key={interview.interviewId}
                                                    
                                                />
                                            ))}
                                        {visibleInterviews < jobInterviews.length && (
                                            <div className="w-full flex justify-end my-[1.667vw]">
                                                <ArrowButton
                                                    type="arrowTransparent"
                                                    action={handleLoadMore}
                                                    label="Load More"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default DashboardHome;
