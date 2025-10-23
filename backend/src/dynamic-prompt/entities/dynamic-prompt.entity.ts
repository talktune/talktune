import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class DynamicPrompt {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Unique identifier for the dynamic prompt' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Name of the prompt' })
  promptName: string;

  @OneToMany(() => DynamicPromptObject, promptObject => promptObject.dynamicPrompt)
  @Field(() => [DynamicPromptObject], { description: 'Prompt object' })
  prompt: DynamicPromptObject[];
}

@Entity()
@ObjectType()
export class DynamicPromptObject {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Unique identifier for the dynamic prompt object' })
  id: string;

  @Column({ nullable: true, type: 'int' })
  @Field(() => Int, { description: 'Stage number', nullable: true })
  stageNumber?: number;

  @Column({ nullable: true, type: 'int' })
  @Field(() => Int, { description: 'Number of quizzes'})
  noOfQuiz: number;

  @Column({ nullable: true, type: 'int' })
  @Field(() => Int, { description: 'Preparation time', nullable: true })
  preparationTime?: number;

  @Column({ nullable: true, type: 'int' })
  @Field(() => Int, { description: 'Quiz time', nullable: true })
  quizTime?: number;

  @Column({ nullable: true, type: 'text' })
  @Field(() => String, { description: 'Prompt template', nullable: true })
  promptTemplate?: string;

  @Column()
  @Field(() => Boolean, { description: 'Indicates if time is limited' })
  isTimeLimited: boolean;

  @Column()
  @Field(() => Boolean, { description: 'Indicates if quiz is limited' })
  isQuizLimited: boolean;

  @Column({ nullable: true, type: 'text' })
  @Field(() => String, { description: 'Validation template', nullable: true })
  validationTemplate?: string;

  @ManyToOne(() => DynamicPrompt, dynamicPrompt => dynamicPrompt.prompt)
  @Field(() => DynamicPrompt, { description: 'Associated dynamic prompt' })
  dynamicPrompt: DynamicPrompt;
}