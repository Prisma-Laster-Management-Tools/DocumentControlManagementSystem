import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';
import { CreateSalesDataDTO } from './dto/create-sales-data.dto';
import { SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(SalesRepository)
    private salesRepository: SalesRepository,
  ) {}

  async createSalesData(createSalesDataDTO: CreateSalesDataDTO) {
    return this.salesRepository.createSalesData(createSalesDataDTO);
  }

  async getAllSalesData() {
    return ResponseMsg.success(await this.salesRepository.find());
  }
}
