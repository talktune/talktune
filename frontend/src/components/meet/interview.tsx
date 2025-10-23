"use client";

import useSelectedStrings from "@/constants/strings";
import { useInterviewContext } from "@/context/InterviewContext";
import useInterview from "@/hooks/useInterview";
import useMediaRecorder from "@/hooks/useMediaRecorder";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import useTextToSpeech from "@/hooks/useTextToSpeech";
import useWebsocket from "@/hooks/useWebsocket";
import { Modal } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PopupDialog from "../common/PopupDialog";
import LoaderImage from "../meet/LoaderImage";
import CountdownTimer from "./CountdownTimer";
import InterviewEndPanel from "./InterviewEndPanel";
import InterviewReload from "./InterviewReload";
import InterviewStickyFooter from "./InterviewStickyFooter";
import InterviewTimer from "./InterviewTimer";
import SpeakingEffect from "./SpeakingEffect";
import UserSpeakingEffect from "./UserSpeakingEffect";
import InterviewPreferences from "./InterviewPreferences";
import { generateDynamicPrompt } from "@/lib/queries/interviews";
import { WebSocketResponsePayloadType } from "@/interfaces/webSocket";



function Interview() {
    const selectedStrings = useSelectedStrings();

    const [isPlaying, setIsPlaying] = useState(false);
    const [isEndPopupOpen, setEndPopupOpen] = useState(false);
    const [isSocketTimeout, setIsSocketTimeout] = useState(false);
    const [isSocketTimeoutLoad, setIsSocketTimeoutLoad] = useState(false);
    const [startTimerStatus, setStartTimerStatus] = useState("LOADING");
    const [loaderTexts, setLoaderTexts] = useState([
        selectedStrings.textInterPrepare,
        selectedStrings.textInterviewThanks,
        selectedStrings.textInterviewStart,
    ]);
    const [loaderTextIndex, setLoaderTextIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [isDisplayClosedCaptions, setIsDisplayClosedCaptions] = useState(true);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isPausedInterview, setIsPausedInterview] = useState(false);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(true);
    const [interviewerProfilePic, setInterviewerProfilePic] = useState("");
    const [confidence, setConfidence] = useState(false);
    const [isOnSocketClosedByUserPopup, setIsOnSocketClosedByUserPopup] =
        useState(false);

    const [isSocketReConnecting, setIsSocketReConnecting] = useState(false);

    const isInterviewClosed = useRef(false);
    const initialCountDownOvered = useRef(false);
    const isConnected = useRef(false);
    const callActive = useRef(false);
    const chunks = useRef<any>([]);
    const oneTimeChunk = useRef<any>([]);
    const interimAnswer = useRef("");
    const activityId = useRef("");
    const isQuizRefresh = useRef(false);
    const isCountdownReset = useRef(false);
    const interviewData = useRef<any>(null);
    const email = useRef<any>(null);
    const router = useRouter();
    const isPaused = useRef(false);
    const currentToken = useRef<any>(0);
    const isStartAnswering = useRef(false);
    const isFirstQuizReceived = useRef(false);
    const currentAnswerDuration = useRef<any>(0);
    const isCancelledInterview = useRef(false);
    const isSocketError = useRef(false);
    const resultWaiting = useRef<any>(null);
    const finalTextTranscript = useRef<any>("");
    const questionAskTime = useRef(0);
    const answerGivenTime = useRef(0);
    const preTextState = useRef("");
    const questionState = useRef("");
    const receivedStageNo = useRef(0);
    const receivedQuizNo = useRef(0);
    const isTimeLimited = useRef(false);
    const preparationTime = useRef(0);
    const questionTime = useRef(0);
    const isPreTextExecuted = useRef(false);
    const isInterviewTimeout = useRef(false);
    const isInterviewEndReceived = useRef(false);
    const generatedPrompt = useRef([]);
    const isRedirectToHome = useRef(false);
    const currentQuestionRef = useRef<any>("");
    const currentStageNoRef = useRef(0);
    const currentQuizNoRef = useRef(0);
    const currentPreparationTime = useRef(0);
    const currentQuestionTime = useRef(0);
    const isOnProfilePicLoader = useRef(true);
    const isSendingAnswerResponse = useRef(false);
    const isStoppedCallTriggered = useRef(false);
    const objectIds = useRef<any>([]);
    const isNewQuestion = useRef(true);
    const isInitialRender = useRef(true);
    const isMicMuteByUser = useRef(false);
    const isSocketClosedByUser = useRef(false);
    const websocketTimer = useRef<any>(null);
    const {
        promptTemplateID,
        userSelectedSchema,
        timeLimit,
        category,
        interviewText,
        interviewTimeLimit,
        resetSchema,
        interviewStages,
        isInterimEnabled,
    } = useInterviewContext();


    //MARK: Handle next question

    const handleNextQuestion = async (pretext: any, question: any) => {
        isNewQuestion.current = true;
        isStartAnswering.current = false;
        isSendingAnswerResponse.current = false;
        currentPreparationTime.current = preparationTime.current;
        currentQuestionTime.current = questionTime.current;
        await handleStopCall();
        questionAskTime.current = Date.now();
        if (preTextState.current != "") {
            isPreTextExecuted.current = true;
        }
        textToSpeech(preTextState.current != "" ? pretext : question);
    };

    //MARK: handle web socket message
    const handleSocketOnMessage = (event: any) => {
        const data: WebSocketResponsePayloadType = event.message;
        if (data) {
            objectIds.current = data.objectIds;
            preTextState.current = data.pretext;
            questionState.current = data.currentQuestion;
            receivedStageNo.current = data.currentStageNo;
            receivedQuizNo.current = data.currentQuestionNo;
            isTimeLimited.current = data.isTimeLimited;
            // currentToken.current += parseInt(data.tokens);

            if (data.isInterviewEndReceived) {
                isInterviewEndReceived.current = true;
            }
            if (isSocketError.current) {
                setIsSocketTimeout(false);
                isSocketError.current = false;
            }

            if (activityId.current != data.activityId) {
                activityId.current = data.activityId;
            }
            if (!isFirstQuizReceived.current) {
                setStartTimerStatus("BEGIN");
                initialCountDownOvered.current = true;
            }
            if (isQuizRefresh.current && isFirstQuizReceived.current) {
                handleNextQuestion(data.pretext, data.currentQuestion);
                isQuizRefresh.current = false;
            } else {
            }
        }
    };
    //MARK: Interview Initialize Methods

    const initializeInterview = async () => {
        await getInterviewData();
        await requestForInterview();
        setTimeout(() => {
            if (!activityId.current || activityId.current == "") {
                setIsSocketTimeout(true);
                isSocketError.current = true;
                setTimeout(() => {
                    setIsSocketTimeoutLoad(true);
                }, 15000);
            }
        }, 25000);
    };

    const handleSocketOnOpen = async () => {
        if (isConnected.current == false) {
            isConnected.current = true;
            // connectMicrophone();
            initializeSpeechRecognition();
            initializeInterview();
        } else if (isSocketClosedByUser.current == true) {
            await handlePauseInterview();
            isSocketClosedByUser.current = false;
            setIsOnSocketClosedByUserPopup(false);
            setIsSocketReConnecting(false);
        }
    };

    const { send, connectSocket, closeSocket } = useWebsocket(
        {
            onOpen: handleSocketOnOpen,
            onMessage: handleSocketOnMessage
        }
    );
    const requestSocketConnection = async () => {
        if (generatedPrompt.current.length === 0) {
            const prompt = await generateDynamicPrompt(
                promptTemplateID,
                userSelectedSchema
            );

            generatedPrompt.current = prompt;
            resetSchema();
        }

        if (isConnected.current === false) {
            connectSocket();
        }
    };

    useEffect(() => {
        if (Object.keys(userSelectedSchema).length !== 0) {
            setIsPreferencesOpen(false);
            requestSocketConnection();
        }
    }, [userSelectedSchema]);

    const handleStaticTemplateInterviews = async () => {
        setIsPreferencesOpen(false);
        requestSocketConnection();
    };

    //////////////////////////////////////////////////////////////////////

    ///////////////  INTERVIEW CONTEXT  //////////////////////

    const { requestForInterview, sendAnswerResponse, sendInterimAnswer } =
        useInterview(
            {
                send,
                activityId,
                interviewData,
                email,
                currentAnswerDuration,
                currentQuestion,
                isInterviewTimeout,
                timeLimit,
                category,
                interviewText,
                generatedPrompt,
                currentQuizNoRef,
                currentStageNoRef,
                objectIds,
                isNewQuestion,
                interviewStages
            }
        );

    ///////////////////  MEDIA DEVICES  ///////////////////////////
    const handleRecorderOnDataAvailable = (event: any) => {
        chunks.current.push(event.data);
    };

    const handleRecorderOnStop = async () => {
        if (!isPaused.current) {
            oneTimeChunk.current = oneTimeChunk.current.concat(chunks.current);
            const blob: any = new Blob(chunks.current, { type: "audio/wav" });

            // const duration = await getBlobDuration(blob);
            // currentAnswerDuration.current = duration;
        }

        chunks.current = [];
    };

    const {
        connectMicrophone,
        startRecording,
        stopRecording,
        closeMediaRecorder,
        getBlobDuration,
        mediaStream,
    } = useMediaRecorder(handleRecorderOnDataAvailable, handleRecorderOnStop);

    ///////////////////  SPEECH RECOGNITION  //////////////////////
    const handleRecognitionOnResult = async (event: any) => {
        if (isFirstQuizReceived.current == false) {
            return;
        }
        // Clear the timeout if a result is received
        if (isStartAnswering.current == false) {
            isStartAnswering.current = true;
        }
        clearTimeout(resultWaiting.current);
        stopAudioPlayback();
        if (answerGivenTime.current == 0) {
            answerGivenTime.current = Date.now();
        }
        if (event.results.length > 0 && isMicMuteByUser.current == false) {
            setConfidence(true);
        } else {
            setConfidence(false);
        }
        const ifFinal = event.results[event.results.length - 1].isFinal;

        if (ifFinal && !isPaused.current) {
            // Handle final transcript
            const transcriptObj = event.results[event.results.length - 1][0];
            const finalText = transcriptObj.transcript;
            finalTextTranscript.current = finalTextTranscript.current + finalText;
            // finalTranscripts.current.push(finalText);
            setConfidence(false);

            const transcript = finalTextTranscript.current.trim();
            interimAnswer.current = transcript; // Store the entire interim text
            if (isInterimEnabled) {
                sendInterimAnswer(transcript, false, "onGoing");
            }
            resultWaiting.current = setTimeout(async () => {
                if (!isInterimEnabled) {
                    sendInterimAnswer(transcript, false, "onGoing");
                }
                handleStopCall();

                await sendAnswerResponse(
                    {
                        data: finalTextTranscript.current,
                        answerGivenTime: answerGivenTime.current,
                        questionAskTime: questionAskTime.current,
                        question: currentQuestionRef.current
                    }
                );
                isSendingAnswerResponse.current = true;
                isOnProfilePicLoader.current = true;
                setCurrentQuestion("");
                currentToken.current = 0;
                answerGivenTime.current = 0;
                questionAskTime.current = 0;
                interimAnswer.current = "";

                finalTextTranscript.current = "";

                if (preTextState.current != "" || questionState.current != "") {
                    isQuizRefresh.current = false;
                    await handleNextQuestion(preTextState.current, questionState.current);
                } else {
                    isQuizRefresh.current = true;
                }
            }, 5000);
        }
    };

    useEffect(() => {
        const handleRouteChange = () => {
            if (isInitialRender.current) {
                // If it's the initial render, do nothing
                isInitialRender.current = false;
                return;
            }

            // Trigger cleanup only on route changes after the initial render
            isRedirectToHome.current = true;
            // closeMediaRecorder();

            pauseTextToSpeech();
            closeSocket();

            isInterviewClosed.current = true;
            // closeMediaRecorder();
            closeRecognition();
            callActive.current = false;
            chunks.current = [];
            isConnected.current = false;
        };

        const handleBeforeUnload = () => {
            handleRouteChange();
        };

        // Add the event listener for page unload
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            // Cleanup when component unmounts or route changes
            window.removeEventListener("beforeunload", handleBeforeUnload);
            handleRouteChange();
        };
    }, []);

    // Inside your component, use useEffect to update the loader text on a timer
    useEffect(() => {
        if (startTimerStatus == "LOADING" && isPreferencesOpen == false) {
            const timer = setInterval(() => {
                // Increment the text index or reset to 0 if it exceeds the array length
                setLoaderTextIndex((prevIndex) =>
                    prevIndex === loaderTexts.length - 1 ? 0 : prevIndex + 1
                );
                if (initialCountDownOvered.current == true) {
                    clearInterval(timer);
                }
            }, 3000); // Change the interval (in milliseconds) as needed

            // Clear the timer on component unmount or when not needed
            return () => clearInterval(timer);
        }
    }, [isPreferencesOpen]);

    const handleRecognitionOnSpeechEnd = () => {
        if (isConnected.current) {
            // stopRecording();
        }
    };

    const stopAudioPlayback = () => {
        setIsPlaying(false);
    };

    const {
        startListening,
        stopListening,
        closeRecognition,
        initializeSpeechRecognition,
    } = useSpeechRecognition(
        handleRecognitionOnResult,
        handleRecognitionOnSpeechEnd,
        callActive
    );

    ///////////////////  UTILITY FUNCTIONS  ////////////////////////////

    const handleStartCall = () => {
        if (isConnected.current) {
            // start media recorder and speech recognition
            // startRecording();
            startListening();
            callActive.current = true;
        }
    };

    const handleStopCall = () => {
        isStoppedCallTriggered.current = true;
        // stopRecording();
        stopListening();
        stopAudioPlayback();
        callActive.current = false;
    };

    const handleContinueCall = () => {
        isStoppedCallTriggered.current = false;
        if (!isMicMuteByUser.current) {
            // startRecording();
            startListening();
            callActive.current = true;
        }
    };

    /////////////// To End Interview //////////////////////

    const endInterviewRefs = async () => {
        isInterviewClosed.current = true;
        // closeMediaRecorder();
        closeRecognition();
        callActive.current = false;
        chunks.current = [];
        closeSocket();
        isConnected.current = false;
    };

    const handleEndInterview = async (isEnd?: boolean) => {
        if (isEnd == true) {
            setEndPopupOpen(false);
            isCancelledInterview.current = true;
            endInterviewRefs();
        } else {
            setEndPopupOpen(false);
            if (isPreTextExecuted.current == true) {
                isPreTextExecuted.current = false;
                preTextState.current = "";
                textToSpeech(questionState.current);
                setCurrentQuestion("");
                isOnProfilePicLoader.current = true;

                currentQuestionRef.current = questionState.current;
                currentStageNoRef.current = receivedStageNo.current;
                currentQuizNoRef.current = receivedQuizNo.current;
            } else {
                handleStartCall();
            }

            isPaused.current = false;
        }
    };

    //MARK: TEXT TO SPEECH

    const {
        //  initializeTextToSpeech,
        textToSpeech,
        pauseTextToSpeech,
    } = useTextToSpeech(
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
        }
    );

    useEffect(() => {
        if (startTimerStatus === "END" && !isFirstQuizReceived.current) {
            currentPreparationTime.current = preparationTime.current;
            currentQuestionTime.current = questionTime.current;

            handleStopCall();
            questionAskTime.current = Date.now();
            if (preTextState.current != "") {
                isPreTextExecuted.current = true;
            }
            textToSpeech(
                preTextState.current == ""
                    ? questionState.current
                    : preTextState.current
            );
            isFirstQuizReceived.current = true;
        }
    }, [startTimerStatus]);

    const getInterviewData = async () => {

        const userData = {}

        setInterviewerProfilePic("Shimmer.jpg");

        return userData;
    };

    //MARK: reDirectToHome
    const reDirectToHome = () => {
        router.push("/");
    };

    const handleSubtitle = async () => {
        setIsDisplayClosedCaptions(!isDisplayClosedCaptions);
    };

    const handleShowPopup = () => {
        setEndPopupOpen(true);

        if (isPaused.current === false) {
            isPaused.current = true;
            pauseTextToSpeech();
            handleStopCall();
        }
    };

    // const handleBeforeUnload = () => {
    //   if (mediaStream.current) {
    //     mediaStream.current.getTracks().forEach((track: any) => {
    //       track.stop();
    //       track.enabled = false;
    //     });
    //   }
    // };

    // useEffect(() => {
    //   window.addEventListener("beforeunload", handleBeforeUnload);

    //   return () => {
    //     window.removeEventListener("beforeunload", handleBeforeUnload);
    //   };
    // }, []);

    const handleMicrophone = () => {
        if (isMicMuteByUser.current) {
            if (isStoppedCallTriggered.current == false) {
                // startRecording();
                startListening();
                callActive.current = true;
            }
            setIsMicMuted(false);
            isMicMuteByUser.current = false;
        } else {
            setConfidence(false);
            stopListening();
            callActive.current = false;
            setIsMicMuted(true);
            isMicMuteByUser.current = true;
        }
    };

    const reconnectSocket = async () => {
        setIsSocketReConnecting(true);
        await connectSocket();
    };

    const handlePauseInterview = async () => {
        if (isPaused.current == false) {
            setConfidence(false);
            setIsPausedInterview(!isPausedInterview);
            isPaused.current = true;
            pauseTextToSpeech();
            await handleStopCall();
            websocketTimer.current = setTimeout(async () => {
                if (isPaused.current == true) {
                    await closeSocket();
                    isSocketClosedByUser.current = true;
                    setIsOnSocketClosedByUserPopup(true);
                }
            }, 10000);
        } else {
            if (websocketTimer.current) {
                clearTimeout(websocketTimer.current);
                websocketTimer.current = null;
            }
            setIsPausedInterview(!isPausedInterview);
            isPaused.current = false;
            if (isPreTextExecuted.current == true) {
                isPreTextExecuted.current = false;
                preTextState.current = "";
                textToSpeech(questionState.current);
                setCurrentQuestion("");
                isOnProfilePicLoader.current = true;

                currentQuestionRef.current = questionState.current;
                currentStageNoRef.current = receivedStageNo.current;
                currentQuizNoRef.current = receivedQuizNo.current;
            } else {
                handleStartCall();
            }
        }
    };

    return (
        <div className=" pt-[6.07rem] ">
            {!isPreferencesOpen ? (
                <>
                    {isSocketTimeout ? (
                        <InterviewReload
                            reDirectToHome={reDirectToHome}
                            isSocketTimeoutLoad={isSocketTimeoutLoad}
                        />
                    ) : !isInterviewClosed.current && startTimerStatus != "LOADING" ? (
                        <div className="mb-[10vw]">
                            <div className="relative flex flex-col  px-[4.663vw] h-fit">
                                {interviewTimeLimit && (
                                    <InterviewTimer
                                        isInterviewTimeout={isInterviewTimeout}
                                        selectedStrings={selectedStrings}
                                        interviewTimeLimit={interviewTimeLimit.toString()}
                                        category={category}
                                        isPaused={isPaused}
                                    />
                                )}

                                <div className="w-full flex  justify-start">
                                    <p className="justify-start  text-center text-sm text-labelText dark:text-labelTextDark font-medium">
                                        {"John Doe"}
                                    </p>
                                </div>
                                <div className="w-full flex  justify-start">
                                    <p className=" justify-start text-center text-lg text-labelText dark:text-labelTextDark font-medium">
                                        {interviewText}
                                    </p>
                                </div>

                                <div className="flex items-center justify-center mt-[12vh] sm:mt-[5vh] xl:mt-[0vh] h-[30vh] lg:h-[50vh] ">
                                    {isPlaying ? (
                                        <SpeakingEffect
                                            isAnimationOn={isPlaying}
                                            interviewerProfilePic={interviewerProfilePic}
                                        />
                                    ) : (
                                        <CountdownTimer
                                            isCountdownReset={isCountdownReset}
                                            isStartAnswering={isStartAnswering}
                                            sendInterimAnswer={sendInterimAnswer}
                                            isQuizRefresh={isQuizRefresh}
                                            sendAnswerResponse={sendAnswerResponse}
                                            currentToken={currentToken}
                                            questionAskTime={questionAskTime}
                                            answerGivenTime={answerGivenTime}
                                            isOnProfilePicLoader={isOnProfilePicLoader}
                                            currentQuestionRef={currentQuestionRef}
                                            setCurrentQuestion={setCurrentQuestion}
                                            currentPreparationTime={currentPreparationTime}
                                            currentQuestionTime={currentQuestionTime}
                                            handleContinueCall={handleContinueCall}
                                            interviewerProfilePic={interviewerProfilePic}
                                            isSendingAnswerResponse={isSendingAnswerResponse}
                                            isTimeLimited={isTimeLimited}
                                            setStartTimerStatus={setStartTimerStatus}
                                            startTimerStatus={startTimerStatus}
                                            isPaused={isPaused}
                                        />
                                    )}
                                </div>
                                <div className="flex mt-[0vw] lg:mt-[1vw] items-center justify-center min-h-[8.638vh] max-h-[8.638vh]">
                                    {isDisplayClosedCaptions && (
                                        <p className="text-center w-[57.976vw] max-h-[18.638vh] overflow-scroll overflow-x-hidden text-[0.75rem] md:text-[0.99rem] lg:text-[1.29rem] font-medium text-labelText dark:text-labelTextDark custom-scroll">
                                            {currentQuestion ?? ""}
                                        </p>
                                    )}
                                </div>
                            </div>{" "}
                            <UserSpeakingEffect
                                isAnimationOn={confidence}
                                photoUrl={"/assets/icons/man.png"}
                            />
                            <InterviewStickyFooter
                                isMicMuted={isMicMuted}
                                isDisplayCC={isDisplayClosedCaptions}
                                isPausedInterview={isPausedInterview}
                                handleMicrophone={handleMicrophone}
                                handleSubtitle={handleSubtitle}
                                handleShowPopup={handleShowPopup}
                                handlePauseInterview={handlePauseInterview}
                            />
                        </div>
                    ) : isInterviewClosed.current ? (
                        <InterviewEndPanel
                            activityID={activityId.current}
                            reDirectToHome={reDirectToHome}
                            isCancelledInterview={isCancelledInterview.current}
                        />
                    ) : (
                        <LoaderImage
                            src={"/animations/interview-loading.json"}
                            textB={selectedStrings.textReady}
                            textP={loaderTexts[loaderTextIndex]}
                            showBack={true}
                        />
                    )}
                    {isEndPopupOpen && (
                        <Modal
                            open={isEndPopupOpen}
                            onClose={(e) => {
                                handleEndInterview(false);
                            }}
                        >
                            <PopupDialog
                                positiveFunction={() => {
                                    handleEndInterview(true);
                                }}
                                negativeFunction={() => {
                                    handleEndInterview(false);
                                }}
                                positiveBtnLabel={selectedStrings.textYes}
                                negativeBtnLabel={selectedStrings.textNo}
                                noOfButton={2}
                                title={selectedStrings.areYouSure}
                                description={selectedStrings.textMeetLeaveInterview}
                                isLoading={false}
                                disableModalClose={false}
                            />
                        </Modal>
                    )}{" "}
                    {isOnSocketClosedByUserPopup && (
                        <Modal open={isOnSocketClosedByUserPopup}>
                            <PopupDialog
                                positiveFunction={() => {
                                    reconnectSocket();
                                }}
                                negativeFunction={() => { }}
                                positiveBtnLabel={selectedStrings.textYes}
                                negativeBtnLabel={""}
                                noOfButton={1}
                                title={selectedStrings.areYouSure}
                                description={selectedStrings.textMeetDisconnected}
                                isLoading={isSocketReConnecting}
                                disableModalClose={true}
                            />
                        </Modal>
                    )}{" "}
                </>
            ) : (
                <InterviewPreferences
                    handleStaticTemplateInterviews={handleStaticTemplateInterviews}
                />
            )}
        </div>
    );
}

export default Interview;
