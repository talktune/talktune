import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AppService {
    @Query(() => String)
    hello() {
        return 'Hello World!';
    }
}