import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

@Schema()
export class User extends Document {
  @ApiProperty()
  @Prop({required: true, unique: true})
  uid: string;

  @ApiProperty()
  @Prop({unique: true})
  username: string;

  @Prop()
  password?: string;

  @ApiProperty()
  @Prop()
  fullName?: string;

  @ApiProperty()
  @Prop({type: Date, default: Date.now})
  createdAt: Date;

  @ApiProperty()
  @Prop({type: Date, default: Date.now})
  updatedAt: Date;

  constructor(doc: any, uid: string, username: string, password: string, fullName: string, createdAt: Date, updatedAt: Date) {
    super(doc);
    this.uid = uid;
    this.username = username;
    this.password = password;
    this.fullName = fullName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
