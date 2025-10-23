interface SkeletonSearchedCardProps {
    noOfCard: number;
}

function SkeletonSearchedCard({ noOfCard }: SkeletonSearchedCardProps) {
    return (
        <>
            {[...Array(noOfCard)].map((_, index) => (
                <article
                    key={index}
                    className="flex overflow-hidden flex-wrap p-[0.833vw] mt-[1.667vw] first:mt-0 w-full bg-white rounded-2xl shadow-[0px_4px_90px_rgba(0,0,0,0.08)] max-md:max-w-full cursor-pointer hover:scale-100 transition-transform hover:shadow-lg"
                >
                    <div
                        className={` my-auto rounded-lg aspect-[2.15] w-full  sm:w-[429px] max-md:max-w-full bg-skeletonContent dark:bg-skeletonContentDark shimmerEffect`}
                    ></div>
                    <div className="flex overflow-hidden flex-col flex-1 shrink justify-between px-6 py-5 basis-0 w-full  sm:w-[429px]   sm:min-w-[240px] max-md:px-5 max-md:max-w-full">
                        <div
                            className={`w-3/6 h-[30px] rounded-md bg-skeletonContent dark:bg-skeletonContentDark shimmerEffect`}
                        ></div>
                        <div className="flex flex-col mt-[0.856vw] w-full text-[12px] md:text-[16px]  max-md:max-w-full">
                            <div
                                className={`w-5/6 h-[20px] rounded-md bg-skeletonContent dark:bg-skeletonContentDark shimmerEffect`}
                            ></div>

                            <div
                                className={`w-2/6 h-[20px] mt-[0.556vw] rounded-md bg-skeletonContent dark:bg-skeletonContentDark shimmerEffect`}
                            ></div>
                        </div>
                        <div className="flex flex-wrap gap-2 items-start self-start mt-[1.111vw] text-[10px]  sm:text-[14px]  font-medium leading-tight whitespace-nowrap text-gray3">
                            <div
                                className={`w-[70px] h-[25px] rounded-md bg-skeletonContent dark:bg-skeletonContentDark shimmerEffect`}
                            ></div>
                            <div
                                className={`w-[60px] h-[25px] rounded-md bg-skeletonContent dark:bg-skeletonContentDark shimmerEffect`}
                            ></div>
                        </div>
                    </div>
                </article>
            ))}
        </>
    );
}

export default SkeletonSearchedCard;