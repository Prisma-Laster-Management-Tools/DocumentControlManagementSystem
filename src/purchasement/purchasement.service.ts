import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePurchasementPartDetailDTO } from './dto/create-purchasement-part-detail.dto';
import { PurchansementPartRepository } from './purchasement-part.repository';
import { PurchasementRequestRepository } from './purchasement-request.repository';
import { PurchasementSourceRepository } from './purchasement-source.repository';

interface ILinkedRepositories {
  purchasement_part: PurchansementPartRepository;
  purchasement_request: PurchasementRequestRepository;
  purchasement_source: PurchasementSourceRepository;
}

@Injectable()
export class PurchasementService {
  private linked_repositories: Partial<ILinkedRepositories> = {};
  constructor(
    @InjectRepository(PurchansementPartRepository) purchasementPartRepository,
    @InjectRepository(PurchasementSourceRepository) purchasementSourceRepository,
    @InjectRepository(PurchasementRequestRepository) purchasementRequestRepository,
  ) {
    this.linked_repositories.purchasement_part = purchasementPartRepository;
    this.linked_repositories.purchasement_source = purchasementSourceRepository;
    this.linked_repositories.purchasement_request = purchasementRequestRepository;
  }

  //
  // ─── PART ───────────────────────────────────────────────────────────────────────
  //
  async createPartDetail(createPurchasementPartDetailDTO: CreatePurchasementPartDetailDTO) {
    return this.linked_repositories.purchasement_part.createPartDetail(createPurchasementPartDetailDTO);
  }
  // ────────────────────────────────────────────────────────────────────────────────
}
