import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthorizationGuard } from 'src/middleware/adminAuthorization.guard';
import { AuthGuard } from 'src/middleware/verifyToken.guard';
import { CreateVisitDto } from './dto/visit.dto';
import { VisitService } from './visit.service';

@Controller('visit')
@UseGuards(AuthGuard)
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  createVisit(@Body() createVisitDto: CreateVisitDto) {
    return this.visitService.createVisit(createVisitDto);
  }

  @Get()
  @UseGuards(AdminAuthorizationGuard)
  getAllVisits() {
    return this.visitService.getAllVisits();
  }

  @Get(':id')
  getVisitById(@Param('id') id: string) {
    return this.visitService.getVisitById(id);
  }

  @Get('employee/:employeeId')
  getVisitsByEmployee(@Param('employeeId') employeeId: string) {
    return this.visitService.getVisitsByEmployee(employeeId);
  }

  @Get('customer/:customerId')
  getVisitByCustomerId(@Param('customerId') customerId: string) {
    return this.visitService.getVisitByCustomerId(customerId);
  }

  @Put(':id/status')
  updateVisitStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.visitService.updateVisitStatus(id, status);
  }
}
