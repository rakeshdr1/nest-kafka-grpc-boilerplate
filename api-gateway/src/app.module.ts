import { HttpStatus, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { ActivityModule } from './modules/activity/activity.module';
import { AuthModule } from './modules/user/user.module';
import { envSchema } from '@shared/env-schema/env-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'schema.gql'),
        introspection: configService.get('ENV') === 'production' ? false : true,
        playground: configService.get('ENV') === 'production' ? false : true,
        context: async ({ req }) => ({ req }),
        debug: false,
        formatError: (error: any) => {
          return error?.extensions?.exception?.details
            ? JSON.parse(error?.extensions?.exception?.details)
            : {
                name:
                  error?.extensions?.response?.error || 'InternalServerError',
                status:
                  error?.extensions?.response?.statusCode ||
                  HttpStatus.INTERNAL_SERVER_ERROR,
                message: error?.extensions?.response?.message || error,
              };
        },
      }),
    }),
    AuthModule,
    ActivityModule,
  ],
})
export class AppModule {}
