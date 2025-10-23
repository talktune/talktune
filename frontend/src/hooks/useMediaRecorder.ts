import { useRef } from "react";

const useMediaRecorder = (onDataAvailable: any, onStop: any) => {
    const mediaStream: any = useRef(null);
    const mediaRecorder: any = useRef(null);
    const recording = useRef<any>(false);

    // initialize media recorder
    const connectMicrophone = async () => {
        if (mediaRecorder.current) return;
        if (!mediaStream.current) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                    },
                });

                mediaStream.current = stream;
                mediaRecorder.current = new MediaRecorder(mediaStream.current);
                mediaRecorder.current.ondataavailable = onDataAvailable;
                mediaRecorder.current.onstop = onStop;
            } catch (_error) { }
        }
    };

    const startRecording = async () => {
        if (!mediaRecorder.current) {
            return;
        }
        if (!recording.current) {
            try {
                mediaRecorder.current.start();
                recording.current = true;
            } catch (error) {
                mediaStream.current = null;
                mediaRecorder.current = null;
                await connectMicrophone();
                if (!mediaRecorder.current) return;
                mediaRecorder.current.start();
                recording.current = true;
            }
        }
    };

    const stopRecording = () => {
        if (!mediaRecorder.current) return;
        mediaRecorder.current.stop();
        recording.current = false;
    };

    const closeMediaRecorder = () => {
        stopRecording();
        mediaRecorder.current = null;
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach((track: any) => {
                track.stop();
                track.enabled = false;
            });
        }
    };

    const getBlobDuration = (blob: Blob) => {
        const tempAudioEl = document.createElement("audio");

        const durationP = new Promise((resolve, reject) => {
            tempAudioEl.addEventListener("loadedmetadata", () => {
                if (tempAudioEl.duration === Infinity) {
                    tempAudioEl.currentTime = Number.MAX_SAFE_INTEGER;
                    tempAudioEl.ontimeupdate = () => {
                        tempAudioEl.ontimeupdate = null;
                        resolve(tempAudioEl.duration);
                        tempAudioEl.currentTime = 0;
                    };
                }
                // Normal behavior
                else {
                    resolve(tempAudioEl.duration);
                }
            });

            tempAudioEl.addEventListener("error", (err: ErrorEvent) => {
                reject(err);
            });
        });

        tempAudioEl.src = window.URL.createObjectURL(blob);

        return durationP;
    };

    return {
        connectMicrophone,
        startRecording,
        stopRecording,
        closeMediaRecorder,
        getBlobDuration,
        mediaStream,
    };
};

export default useMediaRecorder;
