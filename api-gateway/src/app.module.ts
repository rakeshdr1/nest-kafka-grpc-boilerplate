import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { ActivityModule } from './modules/activity/activity.module';
import { AuthModule } from './modules/user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      autoSchemaFile: true,
      playground: true,
      formatError: (error: any) => {
        return error?.extensions?.exception?.details
          ? JSON.parse(error?.extensions?.exception?.details)
          : {
              name: error?.extensions?.response?.error || 'InternalServerError',
              status: error?.extensions?.response?.statusCode || 500,
              message: error?.extensions?.response?.message || error,
            };
      },
    }),
    AuthModule,
    ActivityModule,
  ],
})
export class AppModule {}
