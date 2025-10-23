import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateInterviewInput, InterviewStageInput } from "./dtos/create-interview.input";
import { Interview, InterviewStage, Preferences, Validation } from "./entities/interviews.entity";
@Injectable()
export class InterviewsService {
  /**
   * This function initializes the interview
   * @param
   * @returns 
   */
  private readonly logger: Logger;

  // MARK: Constructor
  constructor(
    @InjectRepository(Interview)
    private readonly interviewsRepository: Repository<Interview>,
    @InjectRepository(InterviewStage)
    private readonly interviewStageRepository: Repository<InterviewStage>,
    @InjectRepository(Preferences)
    private readonly preferencesRepository: Repository<Preferences>,
    @InjectRepository(Validation)
    private readonly validationRepository: Repository<Validation>,
    private readonly dataSource: DataSource,
  ) {
    this.logger = new Logger("InterviewsService");
  }

  //MARK: Get All Interviews
  async getAllInterviews() {
    try {
      const interviews = await this.interviewsRepository.find();

      if (interviews.length > 0) {
        for (const interview of interviews) {
          const stages = await this.interviewStageRepository.find({
            where: {
              interviewTemplate: interview,
            },
          });

          // interview.tagContents = tagContents;
          interview.interviewStages = stages;

          // Ensure preferences are always an array (empty or filled)
          const preferences = await this.preferencesRepository.find({
            where: {
              interview: interview,
            },
          });

          // If no preferences, set it to an empty array
          if (preferences.length === 0) {
            interview.preferences = [];
          } else {
            for (const preference of preferences) {

              const validation = await this.validationRepository.find({
                where: {
                  preferences: preference,
                },
              });
              preference.validation = validation;
            }
            interview.preferences = preferences;
          }
        }
      }

      return interviews;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        this.logger.error(error.stack);
      } else {
        this.logger.error(error);
      }
    }
  }


  // MARK: Create Interview
  async createInterview(createInterviewInput: CreateInterviewInput): Promise<Interview> {
    const {
      interviewText,
      isTimeLimited,
      timeLimit,
      dynamicTemplateId,
      interviewStages,
      preferences,
      imageUrl,
      tagContents,
      interviewLabel,
      isInterimEnabled,
      description,
      category,
      introduction,
    } = createInterviewInput;

    // Create and save the interview
    const interview = this.interviewsRepository.create({
      interviewText,
      isTimeLimited,
      timeLimit,
      dynamicTemplateId,
      imageUrl,
      interviewLabel,
      isInterimEnabled,
      description,
      category,
      introduction,
      tagContents,
    });
    const savedInterview = await this.interviewsRepository.save(interview);

    // Create and save interview stages
    if (interviewStages && interviewStages.length > 0) {
      const stages = interviewStages.map((stage: InterviewStageInput) =>
        this.interviewStageRepository.create({
          ...stage,
          interviewTemplate: savedInterview,
        }),
      );
      await this.interviewStageRepository.save(stages);
      savedInterview.interviewStages = stages;
    }

    // Create and save preferences
    if (preferences && preferences.length > 0) {
      const savedPreferences = [];
      for (const pref of preferences) {
        const { options, defaultValue, validation, ...prefData } = pref;

        // Save preference
        const preference = this.preferencesRepository.create({
          ...prefData,
          interview: savedInterview,
          options: options,
          defaultValue: defaultValue,
        });
        const savedPreference = await this.preferencesRepository.save(preference);

        // Save validations
        if (validation) {
          const validationEntity = this.validationRepository.create({
            ...validation,
            preferences: savedPreference,
          });
          const savedValidation = await this.validationRepository.save(validationEntity);
          savedPreference.validation = [savedValidation];
        }

        savedPreferences.push(savedPreference);
      }
      savedInterview.preferences = savedPreferences;
    }

    return savedInterview;
  }

  // MARK: Get Interview by ID
  async getInterviewById(interviewId: string): Promise<Interview | null> {
    try {
      const interview = await this.interviewsRepository.findOneBy({ interviewId });

      if (interview) {
        const stages = await this.interviewStageRepository.find({
          where: {
            interviewTemplate: interview,
          },
        });
        interview.interviewStages = stages;

        const preferences = await this.preferencesRepository.find({
          where: {
            interview: interview,
          },
        });

        if (preferences.length > 0) {
          for (const preference of preferences) {

            const validation = await this.validationRepository.find({
              where: {
                preferences: preference,
              },
            });
            preference.validation = validation;
          }
          interview.preferences = preferences;
        }
      }

      return interview;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        this.logger.error(error.stack);
      } else {
        this.logger.error(error);
      }
      return null;
    }
  }

  //MARK: Get Interview by interviewLabel
  async getInterviewByLabel(interviewLabel: string): Promise<Interview | null> {
    try {
      const interview = await this.interviewsRepository.findOneBy({ interviewLabel });

      return interview;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        this.logger.error(error.stack);
      } else {
        this.logger.error(error);
      }
      return null;
    }
  }

  // MARK: Delete Interview by ID
  async deleteInterviewById(interviewId: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find interview stages
      const interviewStages = await this.interviewStageRepository.find({
        where: { interviewTemplate: { interviewId } }
      });

      // Find preferences
      const preferences = await this.preferencesRepository.find({
        where: { interview: { interviewId } },
        relations: ['validation']
      });

      // Delete related entities
      if (preferences.length > 0) {
        // Delete validation for each preference
        for (const preference of preferences) {
          await this.validationRepository.delete({
            preferences: { preferenceId: preference.preferenceId }
          });
        }

        // Delete preferences
        await this.preferencesRepository.delete({
          interview: { interviewId }
        });
      }

      // Delete interview stages
      if (interviewStages.length > 0) {
        await this.interviewStageRepository.delete({
          interviewTemplate: { interviewId }
        });
      }

      // Delete the interview
      await this.interviewsRepository.delete(interviewId);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof Error) {
        this.logger.error(error.message);
        this.logger.error(error.stack);
      } else {
        this.logger.error(error);
      }
      return false;
    } finally {
      await queryRunner.release();
    }
  }
}
