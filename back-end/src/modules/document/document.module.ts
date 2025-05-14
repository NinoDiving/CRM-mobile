import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
