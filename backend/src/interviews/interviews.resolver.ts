import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { InterviewsService } from "./interviews.service";
import { Interview } from "./entities/interviews.entity";
import { CreateInterviewInput } from "./dtos/create-interview.input";



@Resolver(() => Interview)
export class InterviewResolver {
    constructor(private readonly interviewService: InterviewsService) { }

    @Mutation(() => Interview)
    async createInterview(
        @Args('createInterviewInput') input: CreateInterviewInput,
    ): Promise<Interview> {
        return await this.interviewService.createInterview(input);
    }

    @Query(() => Interview)
    async getInterviewById(@Args('id') id: string) {
        return this.interviewService.getInterviewById(id);
    }

    @Mutation(() => Interview)
    async deleteInterviewById(@Args('id') id: string) {
        return this.interviewService.deleteInterviewById(id);
    }

    @Query(() => [Interview])
    async getAllInterviews() {
        return this.interviewService.getAllInterviews();
    }
}
