import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig, AppConfigSchema } from './schemas/app-config.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: AppConfig.name, schema: AppConfigSchema }])],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
