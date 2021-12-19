import { HttpStatus } from '@nestjs/common';

export interface IApiResponse<T> {
  success: boolean;
  status?: HttpStatus;
  message: string;
  data?: T;
  error?: any;
  decryptedData?: any;
}
