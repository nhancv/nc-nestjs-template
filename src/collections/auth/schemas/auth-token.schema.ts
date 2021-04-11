import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

@Schema()
export class AuthToken extends Document {
  @ApiProperty()
  @Prop({required: true, unique: true})
  tid: string; // token id

  @ApiProperty()
  @Prop({required: true})
  uid: string; // user id

  @ApiProperty()
  @Prop({required: true, unique: true})
  accessToken: string;

  @ApiProperty()
  @Prop()
  duration: string;

  @ApiProperty()
  @Prop({type: Date, default: Date.now})
  createdAt: Date;

  @ApiProperty()
  @Prop({type: Date, default: Date.now})
  updatedAt: Date;

  constructor(doc: any, tid: string, uid: string, accessToken: string, duration: string, createdAt: Date, updatedAt: Date) {
    super(doc);
    this.tid = tid;
    this.uid = uid;
    this.accessToken = accessToken;
    this.duration = duration;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);
