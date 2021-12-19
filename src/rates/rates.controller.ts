import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { RatesService } from './rates.service';
import { GetLiveRatesDto } from '../utils/dtos';
import { IApiResponse } from '../utils/interfaces';
import { Rates } from '../entities/rates.entity';

@Controller('rates')
export class RatesController {
  private logger: Logger;

  public constructor(private ratesService: RatesService) {
    this.logger = new Logger('RatesController');
  }

  @Get('/live')
  async getLiveRates(
    @Query(ValidationPipe) liveRatesDto: GetLiveRatesDto,
  ): Promise<IApiResponse<any>> {
    return this.ratesService.getLiveRates(liveRatesDto);
  }

  @Get('/latest')
  async getLatestRate(): Promise<IApiResponse<Rates>> {
    this.logger.verbose(`Get latest rate`);
    return this.ratesService.getLatestRate();
  }

  @Get('/:id')
  async getRateByID(@Param('id') id: number): Promise<IApiResponse<Rates>> {
    this.logger.verbose(`Get Rate by id`);
    return this.ratesService.getRateByID(id);
  }
}
