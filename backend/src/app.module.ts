// src/app.module.ts
import { Module } from '@nestjs/common';
import { DealsModule } from './deals/deals.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [DealsModule],
  providers: [PrismaService],
})
export class AppModule {}
