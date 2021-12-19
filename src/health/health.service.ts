import { HttpStatus, Injectable } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiResponseHandler } from 'src/utils/api';
import { IApiResponse } from 'src/utils/interfaces';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private apiResponseHandler: ApiResponseHandler,
  ) {}

  @HealthCheck()
  public async healthCheck(): Promise<IApiResponse<any>> {
    try {
      const healthCheck = await this.health.check([
        () => this.db.pingCheck('database', { timeout: 1500 }),
      ]);
      return this.apiResponseHandler.handleSuccess(
        `Rates Service Health Check Success`,
        healthCheck,
        HttpStatus.OK,
      );
    } catch (error) {
      return this.apiResponseHandler.handleFailed(
        error.message,
        error.response,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
