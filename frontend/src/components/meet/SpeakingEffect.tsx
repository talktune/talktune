import React, { useState, useEffect, memo } from "react";
import { useSpring, animated } from "react-spring";
import Image from "next/image";

const Circle = memo(({ delay, index }: { delay: number; index: number }) => {
    const animationConfig = {
        from: { scale: 1, opacity: 0 },
        to: { scale: 3, opacity: 1 },
        config: { duration: 800 },
        delay,
    };

    return (
        <animated.div
            className="absolute rounded-full bg-gradient-to-b from-red-600 via-cyan-400 to-teal-500 dark:bg-primaryBg"
            style={{
                ...useSpring(animationConfig),
                width: `${8 + index * 4}vw`,
                height: `${8 + index * 4}vw`,
            }}
        />
    );
});

Circle.displayName = "Circle"; // Add this line

const SpeakingEffect = ({
    isAnimationOn,
    interviewerProfilePic,
}: {
    isAnimationOn: boolean;
    interviewerProfilePic: string;
}) => {
    const [circles, setCircles] = useState<any>([]);

    useEffect(() => {
        let interval: any;
        if (isAnimationOn) {
            interval = setInterval(() => {
                setCircles((prevCircles: any) => {
                    if (prevCircles.length >= 5) {
                        return prevCircles.slice(-4);
                    }
                    return [...prevCircles, { id: Date.now() }];
                });
            }, 200);
        }
        return () => clearInterval(interval);
    }, [isAnimationOn]);

    return (
        <>
            {" "}
            <div className="flex flex-col">
                <div className="relative h-[28.776vw] w-[28.776vw] xl:h-[18vw] xl:w-[18vw]   rounded-full overflow-hidden flex items-center justify-center">
                    {isAnimationOn ? (
                        circles.map((circle: any, index: any) => (
                            <Circle key={circle.id} delay={index * 100} index={index} />
                        ))
                    ) : (
                        <div className="w-full h-full rounded-full bg-white dark:bg-primaryBg" />
                    )}
                    <Image
                        src={`/assets/interviewerProPic/${interviewerProfilePic}`}
                        width={300}
                        height={300}
                        alt="videoSectionleft design"
                        className="rounded-full h-[24.895vw] w-[24.895vw] xl:h-[15vw] xl:w-[15vw] absolute"
                    />
                </div>
                <div className="mt-[1vh] h-[1vh]"></div>
            </div>
        </>
    );
};

SpeakingEffect.displayName = "SpeakingEffect";
export default SpeakingEffect;
