import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';
import { RatesRepository } from './rates.repository';
import { ApiResponseHandler } from 'src/utils/api';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RatesRepository]),
    HttpModule,
    WebsocketModule,
  ],
  controllers: [RatesController],
  providers: [RatesService, ApiResponseHandler],
  exports: [RatesService],
})
export class RatesModule {}
