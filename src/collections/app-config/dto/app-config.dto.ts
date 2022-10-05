import { ApiProperty } from '@nestjs/swagger';

export class AppConfigDto {
  @ApiProperty()
  version: string;

  @ApiProperty()
  maintenance: boolean;

  constructor(version: string, maintenance: boolean) {
    this.version = version;
    this.maintenance = maintenance;
  }
}
