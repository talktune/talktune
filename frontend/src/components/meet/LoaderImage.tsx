import { Player } from "@lottiefiles/react-lottie-player";
import Image from "next/image";

interface LoaderImageProps {
    src: string;
    textB: string;
    textP: string;
    showBack?: boolean;
}

const LoaderImage: React.FC<LoaderImageProps> = ({
    src,
    textB,
    textP,
    showBack = false,
}) => {

    return (
        <div className="text-labelText dark:text-labelTextDark h-[100vh]">
            <div
                className={`flex flex-col items-center justify-center ${showBack ? "h-[84vh]" : "h-screen"
                    } w-full`}
            >
                {!showBack && (
                    <div>
                        <Image
                            src={
                                "/assets/icons/logo.png"
                            }
                            width={140}
                            height={50}
                            alt="TalkTune logo"
                        />
                    </div>
                )}
                <div className="mb-4">
                    <Player
                        autoplay
                        loop
                        src={src || "/animations/loading-animation.json"}
                        style={{ height: "120px", width: "120px" }}
                    />
                </div>
                <h1 className="text-[1.4em] sm:text-2xl">
                    <b>{textB}</b>
                </h1>
                <p className="text-[0.7em] sm:text-[1em] mr-9 ml-9 text-center">
                    {textP}
                </p>
            </div>
        </div>
    );
};

export default LoaderImage;
