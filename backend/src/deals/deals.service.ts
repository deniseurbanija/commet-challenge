import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrmTransformerService } from './crm-transformer.service';
import { CreateDealDto } from './dto/create-deal.dto';

@Injectable()
export class DealsService {
  constructor(
    private prisma: PrismaService,
    private transformerService: CrmTransformerService,
  ) {}

  async importDealsFromCrmA(data: any[]) {
    const transformedDeals = this.transformerService.transformJSON(data);
    return this.prisma.deal.createMany({ data: transformedDeals });
  }

  async importDealsFromCrmB(csvString: string) {
    const transformedDeals = this.transformerService.transformCSV(csvString);
    return this.prisma.deal.createMany({ data: transformedDeals });
  }

  async getAllDeals() {
    return this.prisma.deal.findMany();
  }

  async getTotalCommissions() {
    const result = await this.prisma.deal.aggregate({
      _sum: { commission: true },
    });
    return result._sum.commission || 0;
  }

  async createDeal(createDealDto: CreateDealDto) {
    return this.prisma.deal.create({ data: createDealDto });
  }

  async resetDatabase() {
    return await this.prisma.deal.deleteMany();
  }
}
