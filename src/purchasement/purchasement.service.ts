import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePurchasementPartDetailDTO } from './dto/create-purchasement-part-detail.dto';
import { CreatePurchasementSourceDTO } from './dto/create-purchasement-source.dto';
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
  async getPurchasementPartDetail(part_number: string) {
    return this.linked_repositories.purchasement_part.findOne({ part_number });
  }

  async createPartDetail(createPurchasementPartDetailDTO: CreatePurchasementPartDetailDTO) {
    return this.linked_repositories.purchasement_part.createPartDetail(createPurchasementPartDetailDTO);
  }

  async removePartDetail(part_number: string) {
    const removal = await this.linked_repositories.purchasement_part.delete({ part_number });
    if (!removal.affected) throw new NotFoundException(`Part number of "${part_number}" doesn't exist`);
    return removal;
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── SOURCE ─────────────────────────────────────────────────────────────────────
  //
  async createPurchasementSource(createPurchasementSourceDTO: CreatePurchasementSourceDTO) {
    //check if part is exist or not to be ordered
    const { part_number } = createPurchasementSourceDTO;
    if (!(await this.getPurchasementPartDetail(part_number))) throw new NotFoundException(`Part number of "${part_number}" doesn't exist`);
    // ─────────────────────────────────────────────────────────────────
    return this.linked_repositories.purchasement_source.createPurchasementSource(createPurchasementSourceDTO);
  }
  // ────────────────────────────────────────────────────────────────────────────────
}
