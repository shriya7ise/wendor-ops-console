import { Controller, Get, Param } from '@nestjs/common';
import { VendorAcademyService } from './vendor-academy.service';

// PRD 3.2.5 — Vendor Academy
@Controller('support/vendor-academy')
export class VendorAcademyController {
  constructor(private readonly service: VendorAcademyService) {}

  @Get('summary')
  getSummary() {
    return this.service.getSummary();
  }

  @Get('courses')
  listCourses() {
    return this.service.listCourses();
  }

  @Get('courses/:id')
  getCourse(@Param('id') id: string) {
    return this.service.getCourse(id);
  }
}
