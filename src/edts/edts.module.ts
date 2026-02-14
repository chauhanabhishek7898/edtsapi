import { Module } from '@nestjs/common';
import { EdtsService } from './edts.service';
import { EdtsController } from './edts.controller';
import { DatabaseService } from 'src/common/database/database.service';

@Module({
  controllers: [EdtsController],
  providers: [EdtsService,DatabaseService],
  exports: [EdtsService]
})
export class EdtsModule {}
