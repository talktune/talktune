import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateActivityInput {
    @Field(() => String, { description: 'timeLimit' })
    timeLimit: string;

    @Field(() => String, { description: 'interviewText' })
    interviewText: string;

    @Field(() => String, { description: 'startTime' })
    startTime: string;
}
