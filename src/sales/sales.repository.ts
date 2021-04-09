import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateSalesDataDTO } from './dto/create-sales-data.dto';
import { Sales } from './model/sales.entity';
@EntityRepository(Sales)
export class SalesRepository extends Repository<Sales> {
  private logger = new Logger();

  async createSalesData(createSalesDataDTO: CreateSalesDataDTO) {
    const {
      serial_number,
      product_name,
      customer_name,
      issued_at,
      price,
    } = createSalesDataDTO;
    const salesData = new Sales();
    salesData.serial_number = serial_number;
    salesData.product_name = product_name;
    salesData.customer_name = customer_name;
    salesData.issued_at = issued_at;
    salesData.price = price;
    try {
      await salesData.save();
      return ResponseMsg.success(salesData);
    } catch (error) {
      console.log(error);
    }
  }
}
