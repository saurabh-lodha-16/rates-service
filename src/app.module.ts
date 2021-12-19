import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration, { Config } from './config/configuration';
import { HealthModule } from './health/health.module';
import { RatesModule } from './rates/rates.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(Config().database as TypeOrmModuleOptions),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    RatesModule,
    HealthModule,
    WebsocketModule,
  ],
})
export class AppModule {}
