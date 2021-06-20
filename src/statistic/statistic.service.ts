import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { PurchasementService } from 'src/purchasement/purchasement.service';
import { QualityControlService } from 'src/quality-control/quality-control.service';
import { RecruitmentService } from 'src/recruitment/recruitment.service';

const UNLIMIT_PAGINATE_SETTING = { limit: 100000000, page: 1, search: null };

@Injectable()
export class StatisticService {
  constructor(
    private qualityControlService: QualityControlService,
    private productService: ProductService,
    private purchasementService: PurchasementService,
    private recruitmentService: RecruitmentService,
  ) {}
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

  async getPurchasementStatistic() {
    const { data: purchasement_requests } = await this.purchasementService.getAllPurchasementRequest(UNLIMIT_PAGINATE_SETTING);
    return {
      statistic: {
        totaL_request: purchasement_requests.length,
        total_await_request_to_be_accept: purchasement_requests.filter((data) => data.is_order_accepted === null).length,
        total_rejected_request: purchasement_requests.filter((data) => data.is_order_accepted === false).length,
        total_in_process_request: purchasement_requests.filter((data) => data.purchasement_successfully === false && data.is_order_accepted === true).length,
        total_successfully_request: purchasement_requests.filter((data) => data.purchasement_successfully === true).length,
      },
    };
  }
  async getRecruitmentStatistic() {
    const rc = await this.recruitmentService.getAllRecruitments();
    return {
      statistic: {
        total_generated_link: rc.length,
        total_used_link: rc.filter((data) => data.already_used).length,
        total_unused_link: rc.filter((data) => !data.already_used).length,
      },
    };
  }
}
