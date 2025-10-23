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
                width: `${2 + index * 1}vw`,
                height: `${2 + index * 1}vw`,
            }}
        />
    );
});

Circle.displayName = "Circle"; // Add this line

const UserSpeakingEffect = ({
    isAnimationOn,
    photoUrl,
}: {
    isAnimationOn: boolean;
    photoUrl: string | undefined | null;
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
            <div className="absolute right-[3vw] bottom-[15vh] px-[1.2rem] md:px-[1.8rem] lg:px-[2.5rem] xl:px-[3.5rem] py-[1rem] md:py-[1.2rem] lg:py-[1.8rem] bg-[#efefef] dark:bg-primaryBgDark  rounded-[0.8rem] lg:rounded-[1,2rem]">
                <div className="h-[8.5vw]  w-[8.5vw]  rounded-full overflow-hidden flex items-center justify-center">
                    {isAnimationOn ? (
                        circles.map((circle: any, index: any) => (
                            <Circle key={circle.id} delay={index * 100} index={index} />
                        ))
                    ) : (
                        <div className="w-full h-full rounded-full bg-[#efefef] dark:bg-primaryBgDark" />
                    )}
                    <Image
                        src={photoUrl ?? "/assets/icons/man.png"}
                        width={300}
                        height={300}
                        alt="videoSectionleft design"
                        className="absolute rounded-full h-[7vw]  w-[7vw] "
                    />
                </div>
            </div>
        </>
    );
};

UserSpeakingEffect.displayName = "UserSpeakingEffect";
export default UserSpeakingEffect;
