import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Interview {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID, { description: 'Unique identifier for the interview template' })
    interviewId: string;

    @Column()
    @Field(() => String, { description: 'Label name for the interview' })
    interviewLabel: string;

    @Column()
    @Field(() => String, { description: 'Role name for the interview' })
    interviewText: string;

    @Column()
    @Field(() => String, { description: 'Description for the interview' })
    description: string;

    @Column()
    @Field(() => String, { description: 'Interview category' })
    category: string;

    @Column()
    @Field(() => String, { description: 'Image URL' })
    imageUrl: string;

    @Column()
    @Field(() => Boolean, { description: 'Indicates if the interview is time-limited' })
    isTimeLimited: boolean;

    @Column()
    @Field(() => Int, { description: 'Time limit for the interview' })
    timeLimit: number;

    @Column()
    @Field(() => String, { description: 'Dynamic template ID' })
    dynamicTemplateId: string;

    @Column()
    @Field(() => Boolean, { description: 'Is Interim Enabled' })
    isInterimEnabled: boolean;

    @Column('text', { array: true })
    @Field(() => [String], { description: 'Introduction' })
    introduction: string[]

    @OneToMany(() => InterviewStage, (stage) => stage.interviewTemplate)
    @Field(() => [InterviewStage], { description: 'Stages of the interview', nullable: true })
    interviewStages?: InterviewStage[];

    
    @OneToMany(() => Preferences, (preferences) => preferences.validation)
    @Field(() => [Preferences], { description: 'Preferences for the interview' })
    preferences: Preferences[];

    @Column('text', { array: true })
    @Field(() => [String], { description: 'Tag contents', nullable: true })
    tagContents: string[];
}

@Entity()
@ObjectType()
export class Preferences {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID, { description: 'Unique identifier for the preference' })
    preferenceId: string;

    @Column()
    @Field(() => String, { description: 'name', nullable: true })
    name: string;

    @Column()
    @Field(() => String, { description: 'type', nullable: true })
    type: string;

    @Column()
    @Field(() => String, { description: 'label', nullable: true })
    label: string;

    @Column()
    @Field(() => Boolean, { description: 'removeOption', nullable: true })
    removeOption: boolean;

    @Column()
    @Field(() => Boolean, { description: 'addNewOption', nullable: true })
    addNewOption: boolean;

    @Column()
    @Field(() => Int, { description: 'indexNo', nullable: true })
    indexNo: number;

    @Column({ nullable: true })
    @Field(() => String, { description: 'Place Holder', nullable: true })
    placeHolder?: string;

    @OneToMany(() => Validation, (validation) => validation.preferences)
    @Field(() => [Validation], { description: 'Validation for the preference' })
    validation: Validation[];

    @ManyToOne(() => Interview, (interview) => interview.preferences)
    @Field(() => Interview, { description: 'Associated interview' })
    interview: Interview;

    @Column('text', { array: true })
    @Field(() => [String], { description: 'options', nullable: true })
    options: string[];

    @Column('text', { array: true })
    @Field(() => [String], { description: 'default options', nullable: true })
    defaultValue: string[];
}

@Entity()
@ObjectType()
export class Validation {

    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID, { description: 'Unique identifier for the validation' })
    validationId: string;

    @Column()
    @Field(() => Boolean, { description: 'required', nullable: true })
    required: boolean;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { description: 'min', nullable: true })
    min?: number;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { description: 'max', nullable: true })
    max?: number;

    @ManyToOne(() => Preferences, (preferences) => preferences.validation)
    @Field(() => Preferences, { description: 'Associated preference' })
    preferences: Preferences;
}

@Entity()
@ObjectType()
export class InterviewStage {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID, { description: 'Unique identifier for the interview stage' })
    stageId: string;

    @Column()
    @Field(() => String, { description: 'Interview stage' })
    stage: string;

    @Column()
    @Field(() => Int, { description: 'Stage number' })
    stageNumber?: number;

    @Column()
    @Field(() => Int, { description: 'Number of questions in the stage' })
    numberOfQuestions: number;

    @Column()
    @Field(() => Boolean, { description: 'Indicates if the stage is in order' })
    isStageInOrder: boolean;

    @ManyToOne(() => Interview, (template) => template.interviewStages, { nullable: true })
    @Field(() => Interview, { description: 'Associated interview template', nullable: true })
    interviewTemplate?: Interview;
}