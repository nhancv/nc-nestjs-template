import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

@Schema()
export class AppLog extends Document {

  @ApiProperty()
  @Prop({required: true})
  type: string;

  @ApiProperty()
  @Prop({required: true})
  message: string;

  @ApiProperty()
  @Prop()
  index1?: string;

  @ApiProperty()
  @Prop()
  index2?: string;

  @ApiProperty()
  @Prop()
  index3?: string;

  @ApiProperty()
  @Prop({type: Date, default: Date.now})
  createdAt: Date;

  @ApiProperty()
  @Prop({type: Date, default: Date.now})
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
