import { InputType, Field, Int } from '@nestjs/graphql';


@InputType()
export class CreateInterviewInput {
    @Field(() => String, { description: 'Role name for the interview' })
    interviewText: string;

    @Field(() => String, { description: 'Image URL' })
    imageUrl: string;

    @Field(() => [String], { description: 'Introduction' })
    introduction: string[];

    @Field(() => String, { description: 'Label name for the interview' })
    interviewLabel: string;

    @Field(() => Boolean, { description: 'Is Interim Enabled' })
    isInterimEnabled: boolean;

    @Field(() => String, { description: 'Description for the interview' })
    description: string;

    @Field(() => String, { description: 'Interview category' })
    category: string;

    @Field(() => Boolean, { description: 'Indicates if the interview is time-limited' })
    isTimeLimited: boolean;

    @Field(() => Int, { description: 'Time limit for the interview' })
    timeLimit: number;

    @Field(() => String, { description: 'Dynamic template ID' })
    dynamicTemplateId: string;

    @Field(() => [String], { description: 'Tag content' })
    tagContents: string[];

    @Field(() => [InterviewStageInput], { nullable: true, description: 'Stages of the interview' })
    interviewStages?: InterviewStageInput[];

    @Field(() => [PreferencesInput], { nullable: true, description: 'Preferences for the interview' })
    preferences?: PreferencesInput[];
}



@InputType()
export class InterviewStageInput {
    @Field(() => Int, { description: 'Stage number of the interview' })
    stageNumber: number;

    @Field(() => String, { description: 'Stage name' })
    stage: string;

    @Field(() => Int, { description: 'Number of questions in the stage' })
    numberOfQuestions: number;

    @Field(() => Boolean, { description: 'Indicates if the stage is in order' })
    isStageInOrder: boolean;

    @Field(() => String, { description: 'Interview template ID', nullable: true })
    interviewTemplateId?: string;
}

@InputType()
export class ValidationInput {
    @Field(() => Boolean, { description: 'Required' })
    required: boolean;

    @Field(() => Int, { description: 'Minimum value', nullable: true })
    min?: number;

    @Field(() => Int, { description: 'Maximum value', nullable: true })
    max?: number;
}

@InputType()
export class PreferencesInput {
    @Field(() => String, { description: 'Preference name' })
    name: string;

    @Field(() => String, { description: 'Preference type' })
    type: string;

    @Field(() => [String], { description: 'Default value' })
    defaultValue: string[];

    @Field(() => String, { description: 'placeHolder', nullable: true })
    placeHolder?: string;

    @Field(() => String, { description: 'Label' })
    label: string;

    @Field(() => Boolean, { description: 'Remove option', nullable: true })
    removeOption?: boolean;

    @Field(() => Boolean, { description: 'Add new option', nullable: true })
    addNewOption?: boolean;

    @Field(() => Int, { description: 'Index number', nullable: true })
    indexNo?: number;

    @Field(() => [String], { description: 'Options', nullable: true })
    options?: string[];

    @Field(() => ValidationInput, { description: 'Validation for the preference', nullable: true })
    validation?: ValidationInput;
}

