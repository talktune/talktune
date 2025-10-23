import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDynamicPromptInput } from './dto/create-dynamic-prompt.input';
import { GenerateDynamicPromptInput } from './dto/generate-dynamic-prompt.input';
import { DynamicPrompt, DynamicPromptObject } from './entities/dynamic-prompt.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Handlebars from 'handlebars';
import { Interview } from 'src/interviews/entities/interviews.entity';

@Injectable()
export class DynamicPromptService {

  private readonly logger: Logger;

  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    @InjectRepository(DynamicPrompt)
    private readonly dynamicPromptRepository: Repository<DynamicPrompt>,
    @InjectRepository(DynamicPromptObject)
    private readonly dynamicPromptObjectRepository: Repository<DynamicPromptObject>,
  ) {
    this.logger = new Logger("InterviewsService");
  }

  //MARK: Create a dynamic prompt
  async create(createDynamicPromptInput: CreateDynamicPromptInput) {
    const { prompt, promptName } = createDynamicPromptInput;

    // Create the main dynamic prompt
    const newDynamicPrompt = this.dynamicPromptRepository.create({
      promptName,
    });
    const savedDynamicPrompt = await this.dynamicPromptRepository.save(newDynamicPrompt);

    // Create dynamic prompt objects with all available fields
    const dynamicPromptObjects = prompt.map((promptItem) => {
      return this.dynamicPromptObjectRepository.create({
        id: promptItem.id, // Optional ID
        stageNumber: promptItem.stageNumber,
        noOfQuiz: promptItem.noOfQuiz,
        preparationTime: promptItem.preparationTime,
        quizTime: promptItem.quizTime,
        promptTemplate: promptItem.promptTemplate,
        isTimeLimited: promptItem.isTimeLimited,
        isQuizLimited: promptItem.isQuizLimited,
        validationTemplate: promptItem.validationTemplate,
        dynamicPrompt: savedDynamicPrompt, // Associate with the parent dynamic prompt
      });
    });

    // Save all dynamic prompt objects
    await this.dynamicPromptObjectRepository.save(dynamicPromptObjects);

    // Optionally, attach the created objects to the saved dynamic prompt
    savedDynamicPrompt.prompt = dynamicPromptObjects;

    return savedDynamicPrompt;
  }


  //MARK: Generate dynamic prompt
  async generateDynamicPromptInput(generateDynamicPromptInput: GenerateDynamicPromptInput) {
    try {
      const preferencesSchema = JSON.parse(generateDynamicPromptInput.preferencesSchema);

      const dynamicTemplate = await this.dynamicPromptRepository.findOne({
        where: { id: generateDynamicPromptInput.promptId },
      });

      if (!dynamicTemplate || !dynamicTemplate.id) {
        throw new NotFoundException('Prompt or ID not found');
      }

      const interview = await this.interviewRepository.findOne({
        where: { dynamicTemplateId: dynamicTemplate.id },
      });

      if (!interview || !interview.interviewId) {
        throw new NotFoundException('Interview not found');
      }

      const dynamicTemplateObjects = await this.dynamicPromptObjectRepository.find({
        where: { dynamicPrompt: dynamicTemplate },
      });

      dynamicTemplate.prompt = dynamicTemplateObjects || [];

      if (Object.keys(preferencesSchema).length === 0) {
        return dynamicTemplate;
      } else {
        for (const promptItem of dynamicTemplate.prompt) {
          const compiledTemplate = Handlebars.compile(promptItem.promptTemplate);
          promptItem.promptTemplate = compiledTemplate(preferencesSchema);
        }
        return dynamicTemplate;
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'An error occurred while generating dynamic prompt');
    }
  }
}  