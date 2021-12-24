import { ApiProperty } from '@nestjs/swagger';

export interface BaseResponse<T> {
  data?: T | null;
  error?: {
    code: number;
    message: string;
  } | null;
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
