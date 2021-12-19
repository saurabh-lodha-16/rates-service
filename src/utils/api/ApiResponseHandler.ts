import { Injectable, HttpStatus } from '@nestjs/common';
import { IApiResponse } from '../interfaces';

@Injectable()
export class ApiResponseHandler {
  public handleSuccess(
    message: string,
    data: any | any[],
    status?: HttpStatus,
  ): IApiResponse<any> {
    return {
      success: true,
      message,
      data,
      status: status ? status : 200,
    } as IApiResponse<any>;
  }

  public handleFailed(
    message: string,
    error?: any,
    status?: HttpStatus,
  ): IApiResponse<any> {
    return {
      success: false,
      message,
      error: error ? error : null,
      status: status ? status : 500,
    } as IApiResponse<any>;
  }

  public isSuccessfulRequest(statusCode: HttpStatus): boolean {
    return statusCode >= 200 && statusCode < 300;
  }
}
