import { AnswerFromUserMessageType, InitializeInterviewMessageType, InterimAnswerMessageType, WebSocketPayloadDataType } from "@/interfaces/webSocket";
import { MutableRefObject } from "react";

interface UseInterviewProps {
  send: (data: any) => void;
  activityId: MutableRefObject<string>;
  interviewData: any;
  email: any;
  currentAnswerDuration: any;
  currentQuestion: any;
  isInterviewTimeout: MutableRefObject<boolean>;
  timeLimit?: number;
  category: string;
  interviewText: string;
  generatedPrompt: any;
  currentQuizNoRef: MutableRefObject<number>;
  currentStageNoRef: MutableRefObject<number>;
  objectIds: MutableRefObject<string[]>;
  isNewQuestion: MutableRefObject<boolean>;
  interviewStages: any;
}

interface SendAnswerResponseProps {
  data: string;
  answerGivenTime: number;
  questionAskTime: number;
  question: string;
}
const CANDIDATE_NAME = "John Doe";

function useInterview({
  send,
  activityId,
  interviewData,
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
  interviewStages,
}: UseInterviewProps) {


  //MARK: Request for Interview 
  const requestForInterview = async () => {

    const message: InitializeInterviewMessageType = {
      currentTime: Date.now(),
      dynamicTemplate: generatedPrompt.current,
      candidateName: CANDIDATE_NAME,
      isInterviewTimeout: isInterviewTimeout.current,
      timeLimit: timeLimit!,
      interviewText: interviewText,
      qnaObjectIds: objectIds.current,
      isNewQuestion: isNewQuestion.current,
      category: category,
      interviewId: "",
      startTime: Date.now(),
    };

    const initializeInterview: WebSocketPayloadDataType = {
      message: message,
      requestMethod: "initializeInterview",
    };

    const payload = {
      ...initializeInterview,
    };
    send(JSON.stringify(payload));
  };


  //MARK: SendAnswerResponse
  const sendAnswerResponse = async ({
    data,
    answerGivenTime,
    questionAskTime,
    question,
  }: SendAnswerResponseProps) => {

    const message: AnswerFromUserMessageType = {
      activityId: activityId.current,
      answer: data,
      question: question,
      currentAnswerDuration: currentAnswerDuration.current,
      currentQuestionTimeLimit: timeLimit!,
      answerGivenTime: answerGivenTime,
      questionAskTime: questionAskTime,
    }

    const answerData: WebSocketPayloadDataType = {
      message: message,
      requestMethod: "answerFromUser",
    };

    const payload = {
      ...answerData,
    }

    send(JSON.stringify(payload));
    currentAnswerDuration.current = 0;
  };

  //MARK: SendInterimAnswer
  const sendInterimAnswer = async (
    data: string,
    isIncrementCount: boolean,
    requestType: "onGoing" | "notAnswered" | "end" |"interrupted"
  ) => {

    const message: InterimAnswerMessageType = {
      qnaObjectIds: objectIds.current,
      dynamicTemplate: generatedPrompt.current,
      category: category,
      questionNo: currentQuizNoRef.current,
      stageNo: currentStageNoRef.current,
      isInterviewTimeout: isInterviewTimeout.current,
      isNewQuestion: isNewQuestion.current,
      answer: data,
      candidateName: CANDIDATE_NAME,
      interimType: requestType,
      activityId: activityId.current,
      isQuizLimited: interviewStages[currentStageNoRef.current]?.isQuizLimited,
    }

    const answerData: WebSocketPayloadDataType = {
      message: message,
      requestMethod: "interimAnswer",
    };

    const payload = {
      ...answerData,
    };
    send(JSON.stringify(payload));
  };

  return {
    requestForInterview,
    sendAnswerResponse,
    sendInterimAnswer,
    currentQuestion,
  };
}

export default useInterview;
