import { Injectable, NotFoundException } from '@nestjs/common';
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

  async removeSalesData(id: number) {
    try {
      const removal = await this.salesRepository.delete(id);
      if (!removal.affected) {
        throw new NotFoundException(
          `Sale detail with id "${id}" doesn't exist`,
        );
      }
      return ResponseMsg.success(removal);
    } catch (error) {
      throw error; //throw the error for nestjs to handler in the proper form
    }
  }
}
