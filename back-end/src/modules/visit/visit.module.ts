import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config/database.module';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VisitController],
  providers: [VisitService],
})
export class VisitModule {}
