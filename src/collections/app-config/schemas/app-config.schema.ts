import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

@Schema()
export class AppConfig extends Document {
  @ApiProperty()
  @Prop({required: true, unique: true})
  version: string;

  @ApiProperty()
  @Prop({required: true})
  maintenance: boolean;

  @ApiProperty()
  @Prop({type: Date, default: Date.now})
  createdAt: Date;

  @ApiProperty()
  @Prop({type: Date, default: Date.now})
  updatedAt: Date;

  constructor(version: string, maintenance: boolean, createdAt: Date, updatedAt: Date) {
    super();
    this.version = version;
    this.maintenance = maintenance;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const AppConfigSchema = SchemaFactory.createForClass(AppConfig);
