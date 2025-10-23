import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Activity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID, { description: 'Unique identifier for the activity' })
    activityId: string;

    @Column()
    @Field(() => Date, { description: 'Start time of the activity' })
    startTime?: Date;

    @Column({ nullable: true })
    @Field(() => Date, { description: 'End time of the activity', nullable: true })
    endTime?: Date;

    @Column({ default: false })
    @Field(() => Boolean, { description: 'Indicates if the activity is cancelled', defaultValue: false })
    isCancelled: boolean;

    @Column({ default: 0 })
    @Field(() => Int, { description: 'Number of tokens used', defaultValue: 0 })
    tokens: number;

    @Column()
    @Field(() => String, { description: 'Interview template ID' })
    interviewTemplateId: string;
}