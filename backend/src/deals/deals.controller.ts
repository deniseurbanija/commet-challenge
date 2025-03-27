import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  /**
   * Import deals from CRM A data source
   * @param data Array of deal data from CRM A
   * @returns Number of deals added
   * @throws BadRequestException if data is invalid or empty
   * @throws InternalServerErrorException for server-side errors
   */
  @Post('import/crm-a')
  async importCrmAData(@Body() data: any[]) {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new BadRequestException('Invalid or empty data');
      }
      return await this.dealsService.importDealsFromCrmA(data);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error importing CRM A data:', error);
      throw new InternalServerErrorException('Failed to import CRM A data');
    }
  }

  /**
   * Import deals from CRM B via CSV file upload
   * @param file CSV file containing deal data from CRM B
   * @returns Number of deals added
   * @throws BadRequestException if no file is uploaded or file is empty
   * @throws InternalServerErrorException for server-side errors
   */
  @Post('import/crm-b')
  @UseInterceptors(FileInterceptor('file'))
  async importCrmBData(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      if (file.size === 0) {
        throw new BadRequestException('Uploaded file is empty');
      }

      const csvString = file.buffer.toString('utf-8');

      if (!csvString.trim()) {
        throw new BadRequestException('File contains no data');
      }

      return await this.dealsService.importDealsFromCrmB(csvString);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error importing CRM B data:', error);
      throw new InternalServerErrorException('Failed to import CRM B data');
    }
  }

  /**
   * Retrieve all deals from the system
   * @returns List of all deals
   * @throws InternalServerErrorException if unable to fetch deals
   */
  @Get()
  async getAllDeals() {
    try {
      return await this.dealsService.getAllDeals();
    } catch (error) {
      console.error('Error fetching deals:', error);
      throw new InternalServerErrorException('Failed to retrieve deals');
    }
  }

  /**
   * Calculate total commissions across all deals
   * @returns Object containing total commissions
   * @throws InternalServerErrorException if unable to calculate commissions
   */
  @Get('total-commissions')
  async getTotalCommissions() {
    try {
      const total = await this.dealsService.getTotalCommissions();
      return { totalCommissions: total };
    } catch (error) {
      console.error('Error calculating total commissions:', error);
      throw new InternalServerErrorException(
        'Failed to calculate total commissions',
      );
    }
  }

  /**
   * Create a new deal in the system
   * @param createDealDto Data transfer object for creating a new deal
   * @returns Newly created deal
   * @throws BadRequestException if no deal data is provided
   * @throws InternalServerErrorException for server-side errors
   */
  @Post()
  async createDeal(@Body() createDealDto: CreateDealDto) {
    try {
      if (!createDealDto) {
        throw new BadRequestException('No deal data provided');
      }
      return await this.dealsService.createDeal(createDealDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error creating deal:', error);
      throw new InternalServerErrorException('Failed to create deal');
    }
  }

  @Delete()
  async resetDatabase() {
    return await this.dealsService.resetDatabase();
  }
}
