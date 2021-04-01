import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

@Schema()
export class AppConfig extends Document {
  @Prop({required: true})
  @ApiProperty()
  version: string;

  @Prop({required: true})
  @ApiProperty()
  maintenance: boolean;

  @Prop({type: Date, default: Date.now})
  @ApiProperty()
  createdAt: number;

  @Prop({type: Date, default: Date.now})
  @ApiProperty()
  updatedAt: number;

  constructor(version: string, maintenance: boolean, createdAt: number, updatedAt: number) {
    super();
    this.version = version;
    this.maintenance = maintenance;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const AppConfigSchema = SchemaFactory.createForClass(AppConfig);
