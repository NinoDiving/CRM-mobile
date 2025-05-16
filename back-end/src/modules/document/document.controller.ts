import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/middleware/verifyToken.guard';
import { DocumentService } from './document.service';
import { DocumentDto } from './dto/document.dto';

@Controller('document')
@UseGuards(AuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  uploadDocument(@Body() documentDto: DocumentDto) {
    return this.documentService.uploadDocument(documentDto);
  }

  @Get('visit/:visitId')
  getDocumentsByVisit(@Param('visitId') visitId: string) {
    return this.documentService.getDocumentsByVisit(visitId);
  }

  @Get('customer/:customerId')
  getDocumentsByCustomer(@Param('customerId') customerId: string) {
    return this.documentService.getDocumentsByCustomer(customerId);
  }

  @Delete(':id')
  deleteDocument(@Param('id') id: string) {
    return this.documentService.deleteDocument(id);
  }
}
