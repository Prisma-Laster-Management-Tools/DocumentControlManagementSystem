import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { QualityControlService } from 'src/quality-control/quality-control.service';

@Injectable()
export class StatisticService {
  constructor(private qualityControlService: QualityControlService, private productService: ProductService) {}
  async getQualityControlStatistic() {
    const { data: products } = await this.productService.getAllProduct({ limit: 100000000, page: 1, search: null });
    const statistic = {
      product_count: products.length,
      total_qc_passed: products.filter((data) => data.quality_passed).length,
      total_qc_failed: products.filter((data) => data.quality_passed === false).length,
      total_never_qc: products.filter((data) => data.quality_passed === null).length,
      total_in_queue: products.filter((data) => data.is_in_queue).length,
    };
    return {
      statistic,
    };
  }
}
