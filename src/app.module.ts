import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { EdtsModule } from './edts/edts.module';

@Module({
  imports: [DashboardModule, EdtsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
