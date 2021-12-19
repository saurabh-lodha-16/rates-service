import { IsNotEmpty } from 'class-validator';

export class WSPayloadDto {
  @IsNotEmpty()
  messageType: string;

  @IsNotEmpty()
  data: any;

  @IsNotEmpty()
  roomName: string;
}
