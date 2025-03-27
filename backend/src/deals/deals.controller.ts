import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post('import/crm-a')
  async importCrmAData(@Body() data: any[]) {
    return this.dealsService.importDealsFromCrmA(data);
  }

  @Post('import/crm-b')
  @UseInterceptors(FileInterceptor('file'))
  async importCrmBData(@UploadedFile() file: Express.Multer.File) {
    const csvString = file.buffer.toString('utf-8');
    return this.dealsService.importDealsFromCrmB(csvString);
  }

  @Get()
  async getAllDeals() {
    return this.dealsService.getAllDeals();
  }

  @Get('total-commissions')
  async getTotalCommissions() {
    const total = await this.dealsService.getTotalCommissions();
    return { totalCommissions: total };
  }

  @Post()
  async createDeal(@Body() createDealDto: CreateDealDto) {
    return this.dealsService.createDeal(createDealDto);
  }
}
