import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProtocalForProductDTO } from './dto/create-protocal-for-product.dto';
import { QualityControlProtocolRepository } from './quality-control-protocal.repository';
import { QualityControlRepository } from './quality-control.repository';

interface ILinkedRepositories {
  protocol: QualityControlProtocolRepository;
  product: QualityControlRepository;
}

@Injectable()
export class QualityControlService {
  private linked_repositories: Partial<ILinkedRepositories> = {};
  constructor(
    @InjectRepository(QualityControlProtocolRepository) private qualityControlProtocolRepository: QualityControlProtocolRepository,
    @InjectRepository(QualityControlRepository) private qualityControlRepository: QualityControlRepository,
  ) {
    this.linked_repositories.product = qualityControlRepository;
    this.linked_repositories.protocol = qualityControlProtocolRepository;
  }

  //
  // ─── PROTOCOL ───────────────────────────────────────────────────────────────────
  //
  async createProtocolForProduct(createProtocalForProductDTO: CreateProtocalForProductDTO) {
    return this.linked_repositories.protocol.createProtocolForProduct(createProtocalForProductDTO);
  }
  // ────────────────────────────────────────────────────────────────────────────────
}
