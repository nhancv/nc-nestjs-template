import { ApiProperty } from '@nestjs/swagger';

export interface BaseResponse<T> {
  data?: T;
  error?: {
    code: number;
    message: string;
  };
}

// Api Error Property type
class ErrorResponse {
  @ApiProperty()
  code?: number;
  @ApiProperty()
  message?: string;
}

export class ErrorResponseType {
  @ApiProperty()
  error?: ErrorResponse;
}
