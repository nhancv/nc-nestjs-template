import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppLogDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Log type', example: 'app' })
  type: string;

  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @ApiProperty()
  index1?: string;

  @ApiProperty()
  index2?: string;

  @ApiProperty()
  index3?: string;

  constructor(type: string, message: string, index1: string, index2: string, index3: string) {
    this.type = type;
    this.message = message;
    this.index1 = index1;
    this.index2 = index2;
    this.index3 = index3;
  }
}
