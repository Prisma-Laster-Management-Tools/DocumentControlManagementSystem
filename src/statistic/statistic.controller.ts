import { Controller, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  //
  // ─── QC ─────────────────────────────────────────────────────────────────────────
  //
  @Get('/quality-control')
  getQualityControlStatistic() {
    return this.statisticService.getQualityControlStatistic();
  }
  // ────────────────────────────────────────────────────────────────────────────────
}
