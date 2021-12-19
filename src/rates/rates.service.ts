/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpService, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IApiUrlConfig, IApiResponse } from '../utils/interfaces';
import { GetLiveRatesDto } from '../utils/dtos';
import { RatesRepository } from './rates.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponseHandler } from '../utils/api';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Rates } from '../entities/rates.entity';
import Config from 'src/config/configuration';
const lodash = require('lodash');

@Injectable()
export class RatesService {
  private logger: Logger;

  public constructor(
    @InjectRepository(RatesRepository) private ratesRepository: RatesRepository,
    private httpService: HttpService,
    private apiResponseHandler: ApiResponseHandler,
  ) {
    this.logger = new Logger('RatesService');
  }

  public async getLiveRates(
    liveRatesDto: GetLiveRatesDto,
  ): Promise<IApiResponse<any>> {
    try {
      let rates = {};
      const cryptoApi = this.configureCryptoCompareApi(
        liveRatesDto.from,
        liveRatesDto.to,
      );
      const cryptoApiResponse = await this.httpService
        .get(cryptoApi.url, { headers: cryptoApi.headers })
        .toPromise();
      if (
        cryptoApiResponse &&
        cryptoApiResponse.status === HttpStatus.OK &&
        cryptoApiResponse.data
      ) {
        rates = cryptoApiResponse.data;
      } else {
        const latestRates = (await this.ratesRepository.getLatestRate()).rates;
        if (lodash.isEmpty(latestRates)) {
          return this.apiResponseHandler.handleFailed(
            `Failed to fetch rates`,
            {},
          );
        }
        //parse rates
        const baseCurrencies = liveRatesDto.from.split(',');
        const targetCurrencies = liveRatesDto.to.split(',');
        const filteredRatesByBaseAndTarget = {};
        Object.keys(latestRates).map((baseCurrency) => {
          if (baseCurrencies.includes(baseCurrency)) {
            const targetRatesForBase = latestRates[`${baseCurrency}`];
            const filteredTargetsForBase = {};
            Object.keys(targetRatesForBase).map((targetCurrency) => {
              if (targetCurrencies.includes(targetCurrency)) {
                filteredTargetsForBase[`${targetCurrency}`] =
                  targetRatesForBase[`${targetCurrency}`];
              }
            });
            filteredRatesByBaseAndTarget[`${baseCurrency}`] =
              filteredTargetsForBase;
          }
        });
        rates = filteredRatesByBaseAndTarget;
      }
      if (lodash.isEmpty(rates)) {
        return this.apiResponseHandler.handleFailed(
          `Failed to fetch rates`,
          {},
        );
      }
      return this.apiResponseHandler.handleSuccess(
        `Successfully retrieved rates.`,
        rates,
      );
    } catch (error) {
      this.logger.error(`${error}`);
      return this.apiResponseHandler.handleFailed(
        `Failed to retrieve rates.`,
        error,
      );
    }
  }

  public async getRateByID(id: number): Promise<IApiResponse<Rates>> {
    try {
      const result = await this.ratesRepository.getRateByID(id);
      if (lodash.isEmpty(result)) {
        return this.apiResponseHandler.handleFailed(
          `Failed to get rate by id`,
          {},
          HttpStatus.NOT_FOUND,
        );
      }
      return this.apiResponseHandler.handleSuccess(
        `Successfully retrieved rate by ID ${id}`,
        result,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`${error}`);
      return this.apiResponseHandler.handleFailed(
        'Failed to retrieve latest rates from database',
        error.message,
      );
    }
  }

  public async getLatestRate(): Promise<IApiResponse<Rates>> {
    try {
      const result = await this.ratesRepository.getLatestRate();
      if (lodash.isEmpty(result)) {
        return this.apiResponseHandler.handleFailed(
          `Failed to retrieve latest rate from db`,
          {},
          HttpStatus.NOT_FOUND,
        );
      }
      return this.apiResponseHandler.handleSuccess(
        'Successfully retrieved latest rates from database',
        result,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`${error}`);
      return this.apiResponseHandler.handleFailed(
        'Failed to retrieve latest rates from database',
        error.message,
      );
    }
  }

  @Cron(CronExpression[`${Config().ratesRetrievalInterval}`], {
    name: 'fetchRates',
  })
  private async fetchRates(): Promise<void> {
    try {
      this.logger.verbose(`Fetching rates from CryptoCompare`);

      const cryptoApi = this.configureCryptoCompareApi(
        Config().baseCurrencyPairs,
        Config().targetCurrencyPairs,
      );
      const cryptoApiResponse = await this.httpService
        .get(cryptoApi.url, { headers: cryptoApi.headers })
        .toPromise();

      if (
        cryptoApiResponse &&
        cryptoApiResponse.status === HttpStatus.OK &&
        cryptoApiResponse.data
      ) {
        await this.storeRatesInDb(cryptoApiResponse.data);
      }
    } catch (error) {
      this.logger.error(`${error}`);
    }
  }

  private configureCryptoCompareApi(
    fsyms: string,
    tsyms: string,
  ): IApiUrlConfig {
    let url = Config().cryptoCompareUrl;
    url = url.replace('{fsyms}', `${fsyms}`);
    url = url.replace('{tsyms}', `${tsyms}`);
    const headers = {
      authorization: `Apikey ${Config().cryptoCompareApiKey}`,
    };
    return {
      url: url,
      headers: headers,
    } as IApiUrlConfig;
  }

  private async storeRatesInDb(rates: any): Promise<void> {
    try {
      this.logger.verbose(`Storing rates in DB`);
      this.ratesRepository.insertRates(rates);
      this.logger.verbose(`Storing rates in DB completed`);
    } catch (error) {
      this.logger.error(`${error}`);
    }
  }
}
