import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HealthService } from '../health/health.service';
import { ApiResponseHandler } from 'src/utils/api';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [HealthService, ApiResponseHandler],
})
export class HealthModule {}
