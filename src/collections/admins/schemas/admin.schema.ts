import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

@Schema()
export class Admin extends Document {
  @ApiProperty()
  @Prop({required: true, unique: true})
  uid: string;

  @ApiProperty({description: 'owner, admin'})
  @Prop({required: true})
  role: string; // owner, admin

  @ApiProperty()
  @Prop({type: Date, default: Date.now})
  createdAt: Date;

  @ApiProperty()
  @Prop({type: Date, default: Date.now})
  updatedAt: Date;

  constructor(uid: string, role: string, createdAt: Date, updatedAt: Date) {
    super();
    this.uid = uid;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
