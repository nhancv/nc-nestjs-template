import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

@Schema()
export class AppLog extends Document {

  @Prop({required: true})
  @ApiProperty()
  type: string;

  @Prop({required: true})
  @ApiProperty()
  message: string;

  @Prop()
  @ApiProperty()
  index1?: string;

  @Prop()
  @ApiProperty()
  index2?: string;

  @Prop()
  @ApiProperty()
  index3?: string;

  @Prop({type: Date, default: Date.now})
  @ApiProperty()
  createdAt: Date;

  @Prop({type: Date, default: Date.now})
  @ApiProperty()
  updatedAt: Date;

  constructor(doc: any, type: string, message: string, index1: string, index2: string, index3: string, createdAt: Date, updatedAt: Date) {
    super(doc);
    this.type = type;
    this.message = message;
    this.index1 = index1;
    this.index2 = index2;
    this.index3 = index3;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const AppLogSchema = SchemaFactory.createForClass(AppLog);
