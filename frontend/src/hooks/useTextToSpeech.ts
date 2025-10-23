import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react";
import { getTextToSpeech } from "@/lib/queries/textToSpeech";

interface UseTextToSpeechProps {
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
    handleContinueCall: () => void;
    isPreTextExecuted: MutableRefObject<boolean>;
    questionState: MutableRefObject<string>;
    setCurrentQuestion: Dispatch<SetStateAction<string>>;
    isCountdownReset: MutableRefObject<boolean>;
    isInterviewEndReceived: MutableRefObject<boolean>;
    endInterviewRefs: () => Promise<void>;
    preTextState: MutableRefObject<string>;
    isPaused: MutableRefObject<boolean>;
    isRedirectToHome: MutableRefObject<boolean>;
    currentQuestionRef: MutableRefObject<string>;
    isOnProfilePicLoader: MutableRefObject<boolean>;
    receivedStageNo: MutableRefObject<number>;
    receivedQuizNo: MutableRefObject<number>;
    currentStageNoRef: MutableRefObject<number>;
    currentQuizNoRef: MutableRefObject<number>;
    isTimeLimited: MutableRefObject<boolean>;
}
const useTextToSpeech = (
    {
        setIsPlaying,
        handleContinueCall,
        isPreTextExecuted,
        questionState,
        setCurrentQuestion,
        isCountdownReset,
        isInterviewEndReceived,
        endInterviewRefs,
        preTextState,
        isPaused,
        isRedirectToHome,
        currentQuestionRef,
        isOnProfilePicLoader,
        receivedStageNo,
        receivedQuizNo,
        currentStageNoRef,
        currentQuizNoRef,
        isTimeLimited
    }: UseTextToSpeechProps) => {
    const source = useRef<AudioBufferSourceNode | null>(null);
    const audioContext = new AudioContext();

    const playBeep = () => {
        const audio = new Audio("/sounds/beep.mp3");
        audio.play();
    };

    const textToSpeech = async (text: string) => {
        try {
            const base64AudioData = await getTextToSpeech(text);

            setCurrentQuestion(text);
            isOnProfilePicLoader.current = false;
            
            if (!isPaused.current && !isRedirectToHome.current) {
                if (base64AudioData) {
                    const arrayBuffer = Uint8Array.from(atob(base64AudioData), (c) =>
                        c.charCodeAt(0)
                    ).buffer;

                    const buffer = await audioContext.decodeAudioData(arrayBuffer);

                    if (source.current) {
                        source.current.stop();
                        source.current.disconnect();
                    }

                    source.current = audioContext.createBufferSource();
                    source.current.buffer = buffer;
                    source.current.connect(audioContext.destination);

                    source.current.onended = () => {
                        setIsPlaying(false);

                        if (!isRedirectToHome.current) {
                            if (!isPaused.current && isPreTextExecuted.current) {
                                isPreTextExecuted.current = false;
                                preTextState.current = "";
                                textToSpeech(questionState.current);
                                setCurrentQuestion("");
                                isOnProfilePicLoader.current = true;
                                currentQuestionRef.current = questionState.current;
                                currentStageNoRef.current = receivedStageNo.current;
                                currentQuizNoRef.current = receivedQuizNo.current;
                            } else if (!isPreTextExecuted.current) {
                                if (isInterviewEndReceived.current) {
                                    endInterviewRefs();
                                } else {
                                    questionState.current = "";
                                    isCountdownReset.current = true;
                                    if (!isPaused.current && !isTimeLimited.current) {
                                        handleContinueCall();
                                        playBeep();
                                    }
                                }
                            }
                        }
                    };

                    source.current.start(0);
                    setIsPlaying(true);
                }
            } else {
                if (!isPreTextExecuted.current) {
                    if (isInterviewEndReceived.current) {
                        endInterviewRefs();
                    } else {
                        questionState.current = "";
                        isCountdownReset.current = true;
                    }
                }
            }

        } catch (error) {
            console.error("Error playing audio", error);
        }
    };

    const pauseTextToSpeech = () => {
        if (source.current) {
            source.current.stop();
            source.current.disconnect();
            source.current = null; // Reset sourceRef after stopping
        }
    };

    const resumeTextToSpeech = async () => {
        if (source.current) {
            source.current.stop();
            source.current.start(0);
        }
    };

    return {
        // initializeTextToSpeech,
        textToSpeech,
        pauseTextToSpeech,
        resumeTextToSpeech,
    };
};

export default useTextToSpeech;
