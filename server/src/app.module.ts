import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { HistoryModule } from './modules/history/history.module';
import { GenerateModule } from './modules/generate/generate.module';
import config from './config/config';

const appEnv =
  process.env.APP_ENV ||
  (process.env.NODE_ENV === 'production' ? 'prod' : process.env.NODE_ENV === 'test' ? 'test' : 'dev');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${appEnv}`],
      load: [config],
      cache: true,
      expandVariables: true,
      override: true,
    }),
    DatabaseModule,
    HistoryModule,
    GenerateModule,
  ],
})
export class AppModule {}
