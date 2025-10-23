function SkeletonLines(props: any) {
    const {
        lines = 1,
        width = "w-8/12",
        height = "h-6",
        orientation = "col",
    } = props;
    const skeletonLines = Array.from({ length: lines }, (_, index) => (
        <div
            key={index}
            className={`${width} ${height} rounded-md bg-skeletonContent dark:bg-skeletonContentDark shimmerEffect`}
        ></div>
    ));
    return (
        <div
            className={`flex flex-${orientation} ${lines > 1 ? `gap-2 ${orientation === "col" ? "justify-center gap-2" : "items-center gap-2"}` : ""} my-[2px] w-full h-full`}
        >
            {skeletonLines}
        </div>
    );
}

export default SkeletonLines;