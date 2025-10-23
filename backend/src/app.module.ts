import { Module } from "@nestjs/common";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { AppService } from "./app.service";
import { InterviewsModule } from './interviews/interviews.module';
import { TextToSpeechModule } from './text-to-speech/text-to-speech.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DynamicPromptModule } from "./dynamic-prompt/dynamic-prompt.module";
import { ActivityModule } from "./activity/activity.module";
import { DbStartupModule } from './db-startup/db-startup.module';

@Module({
  controllers: [],
  imports: [
    SecretsManagerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
    ConfigModule,
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        const playground = configService.get("GRAPHQL_PLAYGROUND");
        const introspection = configService.get("GRAPHQL_INTROSPECTION");
        return {
          autoSchemaFile: "schema.graphql",
          sortSchema: true,
          playground,
          introspection: playground || introspection,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    DynamicPromptModule,
    InterviewsModule,
    ActivityModule,
    TextToSpeechModule,
    DbStartupModule,
  ],
  providers: [AppService],
})
export class AppModule { }
