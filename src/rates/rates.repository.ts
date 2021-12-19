import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Rates } from '../entities/rates.entity';

@EntityRepository(Rates)
export class RatesRepository extends Repository<Rates> {
  private logger = new Logger('RatesRepository');

  public async insertRates(_rates: any): Promise<Rates> {
    const rates = new Rates();
    rates.timestamp = Math.floor(new Date().getTime() / 1000);
    rates.rates = _rates;

    try {
      await rates.save();
    } catch (error) {
      this.logger.error(`Failed to insert rates. Data: ${_rates}`, error.stack);
      throw new InternalServerErrorException();
    }

    return rates;
  }

  public async getRateByID(id: number): Promise<Rates> {
    return await this.findOne({ id });
  }

  public async getLatestRate(): Promise<Rates> {
    return await this.findOne({
      order: { id: 'DESC' },
    });
  }

  public async deleteRates(_id: number): Promise<boolean> {
    const entry = await this.findOne({ id: _id });
    try {
      await entry.remove();
    } catch (error) {
      this.logger.error(`Failed to remove rates. Data: ${_id}`, error.stack);
      throw new InternalServerErrorException();
    }

    return true;
  }
}
