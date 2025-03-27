import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateDealDto {
  @IsString()
  id: string;

  @IsNumber()
  amount: number;

  @IsString()
  salesperson: string;

  @IsDate()
  date: Date;

  @IsNumber()
  commission: number;
}
