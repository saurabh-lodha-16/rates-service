import { IsNotEmpty } from 'class-validator';

export class GetLiveRatesDto {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;
}
