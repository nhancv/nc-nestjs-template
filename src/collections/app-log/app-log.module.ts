import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppLogService } from './app-log.service';
import { AppLog, AppLogSchema } from './schemas/app-log.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: AppLog.name, schema: AppLogSchema }])],
  providers: [AppLogService],
  exports: [AppLogService],
})
export class AppLogModule {}
