import { Logger, OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AnswerFromUserMessageType, InitializeInterviewMessageType, InterimAnswerMessageType, WebSocketPayloadDataType } from './interfaces/interviewTypes';
import { InterviewsGatewayService } from './interviewsGateway.service';

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
  }
})

export class InterviewsGateway implements OnModuleInit {
  private readonly logger = new Logger(InterviewsGateway.name);

  constructor(private readonly interviewsGatewayService: InterviewsGatewayService) { }

  // Initialize the gateway
  onModuleInit() {
    this.server?.on('connection', (socket) => {
      this.logger.log('InterviewsGateway has been initialized.');
      this.logger.log(`Socket ID: ${socket.id}`);

      socket.on('disconnect', () => {
        this.logger.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  // Destroy the gateway
  onModuleDestroy() {
    this.server?.close();
    this.logger.log('InterviewsGateway has been destroyed.');
  }

  @WebSocketServer()
  server: Server | undefined;

  @SubscribeMessage('message')
  async initializeInterview(@MessageBody() data: string, @ConnectedSocket() socket: Socket) {

    try {
      const { message, requestMethod }: WebSocketPayloadDataType = JSON.parse(data);

      this.logger.log(`Request Type: ${requestMethod}`);

      switch (requestMethod) {
        case "initializeInterview": {
          const data = message as InitializeInterviewMessageType;

          const payload = await this.interviewsGatewayService.initializeInterview({
            dynamicTemplate: data.dynamicTemplate,
            answer: "",
            candidateName: data.candidateName,
            interviewId: data.interviewId,
            isFirstQuestion: true,
            isNewQuestion: true,
            startTime: data.startTime,
            isInterviewTimeout: data.isInterviewTimeout,
          });

          return socket.emit("message", {
            message: payload,
          });
        }

        case "answerFromUser": {
          const data: AnswerFromUserMessageType = message as AnswerFromUserMessageType;

          const {
            question,
            activityId,
            answer,
            answerGivenTime,
            currentAnswerDuration,
            currentQuestionTimeLimit,
            questionAskTime,
          } = data;

          this.interviewsGatewayService.answerFromUser({
            activityId,
            answer,
            currentAnswerDuration,
            currentQuestionTimeLimit,
            answerGivenTime,
            questionAskTime,
            question,
          });

          return;
        }

        case "interimAnswer": {
          const data: InterimAnswerMessageType = message as InterimAnswerMessageType;

          const trimmedAnswer = data.answer.trim();

          const payload = await this.interviewsGatewayService.interimInterview({
            activityId: data.activityId,
            answer: trimmedAnswer.length > 0 ? data.answer : "User didn't provide any answer",
            candidateName: data.candidateName,
            dynamicTemplate: data.dynamicTemplate,
            category: data.category,
            isInterviewTimeout: data.isInterviewTimeout,
            isNewQuestion: data.isNewQuestion,
            questionNo: data.questionNo,
            isQuizLimited: data.isQuizLimited,
            qnaObjectIds: data.qnaObjectIds,
            stageNo: data.stageNo,
            interimType: data.interimType,
          });

          return socket.emit("message", {
            message: payload,
          });
        }

        default: {
          this.logger.error("Invalid Request Type");
          return;
        }
      }

    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
      } else {
        this.logger.error("An error occurred during interview initialization");
      }
    }
  }


}
