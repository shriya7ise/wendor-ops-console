import { Module } from '@nestjs/common';
import { VendorAcademyController } from './vendor-academy.controller';
import { VendorAcademyService } from './vendor-academy.service';

@Module({
  controllers: [VendorAcademyController],
  providers: [VendorAcademyService],
})
export class VendorAcademyModule {}
