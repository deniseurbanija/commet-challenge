// src/deals/deals.module.ts
import { Module } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CrmTransformerService } from './crm-transformer.service';

@Module({
  controllers: [DealsController],
  providers: [DealsService, PrismaService, CrmTransformerService],
})
export class DealsModule {}
