import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {BaseResponse} from "./responses/base.response";

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return {"data": "Hello World!"}', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHello()).toEqual( {data: "Hello World!"});
    });
  });
});
