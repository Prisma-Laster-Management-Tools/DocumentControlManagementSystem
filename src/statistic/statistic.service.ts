import { Injectable } from '@nestjs/common';
import { CalibrationService } from 'src/calibration/calibration.service';
import { MaintenanceService } from 'src/maintenance/maintenance.service';
import { ProductService } from 'src/product/product.service';
import { PurchasementService } from 'src/purchasement/purchasement.service';
import { QualityControlService } from 'src/quality-control/quality-control.service';
import { RecruitmentService } from 'src/recruitment/recruitment.service';
import { calculateDayPassed, isAlreadyPassedPeriodOfDay } from 'src/utilities/time';

const UNLIMIT_PAGINATE_SETTING = { limit: 100000000, page: 1, search: null };

@Injectable()
export class StatisticService {
  constructor(
    private qualityControlService: QualityControlService,
    private productService: ProductService,
    private purchasementService: PurchasementService,
    private recruitmentService: RecruitmentService,
    private maintenanceService: MaintenanceService,
    private calibrationService: CalibrationService,
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

  async getMaintenanceStatistic() {
    function convert_cycle_type_to_day(dtype: 'd' | 'm' | 'y') {
      if (dtype === 'd') return 1;
      else if (dtype === 'm') return 30;
      else if (dtype === 'y') return 365;
      else null;
    }

    const mt = await this.maintenanceService.getAllMaintenanceList();
    const calibration_lists = await this.calibrationService.getAllCalibrationSchedules();
    const today = new Date(Date.now());
    let hit_period_count = 0;
    for (let target of calibration_lists) {
      const { cycle_info, machine_name, id, serial_number, instruction, cycle_start_at_for_notification_cooldown, cycle_start_at } = target; // don't use pure cycle_start_at []
      /*let cycle_start_at;
      if (cycle_start_at_for_notification_cooldown === null) {
        cycle_start_at = cycle_start_at_pure;
      } else {
        cycle_start_at = cycle_start_at_for_notification_cooldown;
      }*/

      //const cycle_start = new Date(cycle_start_at);
      const day_passed = calculateDayPassed(cycle_start_at, today);
      //console.log(`day passed for ${machine_name} is ${day_passed}`); // DEBUG ONLY

      let every_as_cycle_Regex = new RegExp('(every_)(\\d+)_([dmy])'); // atlease 1 length of digit [note to myself]
      let once_of_as_cycle_Regex = new RegExp('(once_of_)(\\d+)_([dmy])');
      if (every_as_cycle_Regex.test(cycle_info)) {
        const suffix_cycle_type = cycle_info[cycle_info.length - 1];
        const added_amount_for_completion: number = convert_cycle_type_to_day(suffix_cycle_type as 'd' | 'm' | 'y');
        //console.log('found as a every cycle');// DEBUG ONLY
        if (!added_amount_for_completion) continue; //console.log('found invalid cycle_info -> supported [d,m,y]'); // invalid format
        const [full_str, _, num_as_string, __] = every_as_cycle_Regex.exec(cycle_info);
        const multiply_amount = parseInt(num_as_string);
        if (!multiply_amount) continue; //console.log('found invalid multiply amount type -> supported only number');
        const comparison_target_day = added_amount_for_completion * multiply_amount;
        //console.log(comparison_target_day);// DEBUG ONLY
        const hit_period = isAlreadyPassedPeriodOfDay(day_passed, comparison_target_day);
        if (!hit_period) continue; //return; // doesn't hit the period yet
        // hit now
        hit_period_count = hit_period_count + 1;
      } else if (once_of_as_cycle_Regex.test(cycle_info)) {
        const suffix_cycle_type = cycle_info[cycle_info.length - 1];
        const added_amount_for_completion: number = convert_cycle_type_to_day(suffix_cycle_type as 'd' | 'm' | 'y');
        //console.log('found as a once of cycle');// DEBUG ONLY
        if (!added_amount_for_completion) continue; //return console.log('found invalid cycle_info -> supported [d,m,y]'); // invalid format
        const [full_str, _, num_as_string, __] = once_of_as_cycle_Regex.exec(cycle_info);
        const multiply_amount = parseInt(num_as_string);
        if (!multiply_amount) continue; //console.log('found invalid multiply amount type -> supported only number');
        const comparison_target_day = added_amount_for_completion * multiply_amount;
        //console.log(comparison_target_day); // DEBUG ONLY
        const hit_period = isAlreadyPassedPeriodOfDay(day_passed, comparison_target_day);
        if (!hit_period) continue; // doesn't hit the period yet
        hit_period_count = hit_period_count + 1;
        //hit now
      }
    }

    return {
      statistic: {
        total_calibration_schedule: calibration_lists.length,
        total_calibration_period_hit: hit_period_count,
        total_maintenance_schedule: mt.length,
      },
    };
  }
}
