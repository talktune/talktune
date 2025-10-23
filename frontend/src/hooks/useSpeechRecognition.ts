import { useRef } from "react";

const useSpeechRecognition = (
    onResult: any,
    onSpeechEnd: any,
    callActive: any
) => {
    const recognition = useRef<any>(null);

    // initialize speech recognition
    const initializeSpeechRecognition = () => {
        window.SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition.current = new window.SpeechRecognition();
        recognition.current.interimResults = true;
        recognition.current.maxAlternatives = 1;
        recognition.current.continuous = true;

        recognition.current.onend = () => {
            if (callActive.current) {
                startListening();
            }
        };

        recognition.current.onresult = onResult;
        recognition.current.onspeechend = onSpeechEnd;
    };

    const startListening = () => {
        if (!recognition.current) return;
        try {
            recognition.current.start();
        } catch (e) { }
    };

    const stopListening = () => {
        if (!recognition.current) return;
        recognition.current.stop();
    };

    const closeRecognition = () => {
        stopListening();
        recognition.current = null;
    };

    return {
        startListening,
        stopListening,
        closeRecognition,
        initializeSpeechRecognition,
    };
};

export default useSpeechRecognition;
