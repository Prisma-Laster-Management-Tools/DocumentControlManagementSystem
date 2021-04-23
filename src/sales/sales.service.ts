import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateResult, PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';
import { CreateSalesDataDTO } from './dto/create-sales-data.dto';
import { SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(SalesRepository)
    private salesRepository: SalesRepository,
  ) {}

  async findSales(id: number) {
    const sales_data = await this.salesRepository.createQueryBuilder('sales').where(`sales.id = ${id}`).leftJoinAndSelect('sales.feedback', 'feedback').getOne();
    if (!sales_data) throw new NotFoundException(`Sale data with id "${id}" doesn't exist`);
    return sales_data;
  }

  async createSalesData(createSalesDataDTO: CreateSalesDataDTO) {
    return this.salesRepository.createSalesData(createSalesDataDTO);
  }

  // async getAllSalesData() {
  //   return ResponseMsg.success(await this.salesRepository.find());
  // }

  // Note@ could be move to be inside of the repository for modulizing logic parts
  async findAll(paginationDto: PaginationDto): Promise<PaginateResult> {
    const skippedItem = (paginationDto.page - 1) * paginationDto.limit;

    let totalCount = await this.salesRepository.count();
    const query = await this.salesRepository.createQueryBuilder('sales');

    if (paginationDto.search) {
      // if search is provided
      query.where('sales.product_name LIKE :search_str OR sales.serial_number LIKE :search_str OR sales.price = :search_int', {
        search_str: `%${paginationDto.search}%`,
        search_int: parseInt(paginationDto.search) || 0,
      });
    }

    const [getCountPromise, sales_datas] = await Promise.all([
      paginationDto.search
        ? query.getCount()
        : new Promise((resolve) => {
            resolve(false);
          }),
      query.orderBy('sales.createdAt', 'DESC').offset(skippedItem).limit(paginationDto.limit).getMany(),
    ]);

    totalCount = getCountPromise ? (getCountPromise as number) : totalCount;

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: sales_datas,
      totalPage: totalCount < paginationDto.limit ? 1 : Math.floor(totalCount / paginationDto.limit),
    };
  }

  async removeSalesData(id: number) {
    try {
      const removal = await this.salesRepository.delete(id);
      if (!removal.affected) {
        throw new NotFoundException(`Sale detail with id "${id}" doesn't exist`);
      }
      return ResponseMsg.success(removal);
    } catch (error) {
      throw error; //throw the error for nestjs to handler in the proper form
    }
  }
}
