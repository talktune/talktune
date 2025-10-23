'use client';
import { useInterviewContext } from "@/context/InterviewContext";
import { Interview } from "@/interfaces/interview";
import { useRouter } from "next/navigation";

interface InterviewCardProps {
    interviewData: Interview;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({
    interviewData
}) => {
    const { setInterviewPreferences } = useInterviewContext();
    const router = useRouter();

    const handleRoute = () => {
        setInterviewPreferences(
            {
                headerText: interviewData.interviewText,
                interviewLabel: interviewData.interviewLabel,
                timeLimit: interviewData.timeLimit,
                interviewCategory: interviewData.category,
                id: interviewData.interviewId,
                interviewPreferencesSchema: interviewData.preferences,
                intro: interviewData.introduction,
                template: interviewData.dynamicTemplateId,
                stages: interviewData.interviewStages,
                isInterimEnable: interviewData.isInterimEnabled
            }
        );

        router.push(`/meet/`);
    };

    return (
        <article
            className="flex overflow-hidden flex-wrap p-[0.833vw] mt-[1.667vw] first:mt-0 w-full bg-white rounded-2xl shadow-[0px_4px_90px_rgba(0,0,0,0.08)] max-md:max-w-full cursor-pointer hover:scale-100 transition-transform hover:shadow-lg"
            onClick={async () => handleRoute()}
        >
            <div className="relative w-1/3">
                <img
                    src={
                        interviewData.imageUrl
                            ? `/assets/InterviewThumbnail/${interviewData.imageUrl}`
                            : "https://eloque-images.s3.amazonaws.com/projectManager.png"
                    }
                    alt={`${interviewData.interviewText} interview card`}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
            </div>
            <div className="flex overflow-hidden flex-col flex-1 shrink justify-between px-6 py-5 basis-0 w-2/3 max-md:w-full sm:min-w-[240px] max-md:px-5">
                <h2 className="text-[3.667vw] sm:text-[24px] font-medium leading-tight text-black">
                    {interviewData.interviewText}
                </h2>
                <div className="flex flex-col mt-[0.856vw] w-full text-[2.111vw] sm:text-[16px] max-md:max-w-full">
                    <p className="text-gray6 max-md:max-w-full">
                        {interviewData.description}
                    </p>
                    <p className="mt-[0.556vw] font-light text-gray3">
                        minimum {interviewData.timeLimit.toString()} min
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 items-start self-start mt-[1.111vw] text-[1.972vw] sm:text-[14px] font-medium leading-tight whitespace-nowrap text-gray3">
                    {interviewData.tagContents.map((tag, index) => (
                        <span
                            key={index}
                            className="gap-2.5 self-stretch px-[1.556vw] py-[1.278vw] sm:px-[8px] sm:py-[4px] rounded border border-solid border-neutral-400"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </article>

    );
};