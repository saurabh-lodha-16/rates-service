import { Controller, Logger, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { IApiResponse } from 'src/utils/interfaces';

@Controller('health')
export class HealthController {
  private logger: Logger;
  constructor(private healthService: HealthService) {
    this.logger = new Logger('HealthCheckController');
  }

  @Get()
  public async healthCheck(): Promise<IApiResponse<any>> {
    this.logger.verbose(`HealthCheck - RatesService`);
    return await this.healthService.healthCheck();
  }
}
