import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { CreatePurchasementPartDetailDTO } from './dto/create-purchasement-part-detail.dto';
import { CreatePurchasementRequestDTO } from './dto/create-purchasement-request.dto';
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
  async getPurchasementPartDetail(part_number: string, throw_if_not_found: boolean = false) {
    if (!throw_if_not_found) return this.linked_repositories.purchasement_part.findOne({ part_number });
    else if (!(await this.linked_repositories.purchasement_part.findOne({ part_number }))) throw new NotFoundException(`Part number of "${part_number}" doesn't exist`);
  }

  async getAllPartDetail() {
    return await this.linked_repositories.purchasement_part.find();
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
    const _ = await this.getPurchasementPartDetail(part_number, true);
    // ─────────────────────────────────────────────────────────────────
    return this.linked_repositories.purchasement_source.createPurchasementSource(createPurchasementSourceDTO);
  }

  async removePurchasementSource(id: number) {
    const removal = await this.linked_repositories.purchasement_source.delete(id);
    if (!removal.affected) throw new NotFoundException(`Purchasement Source with id == "${id}" doesn't exist`);
    return removal;
  }

  async getAllSource() {
    return await this.linked_repositories.purchasement_source.find();
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── PURCHASEMENT ───────────────────────────────────────────────────────────────
  //
  async createPurchasementRequest(createPurchasementRequestDTO: CreatePurchasementRequestDTO) {
    const { is_special_request, commercial_number } = createPurchasementRequestDTO;
    if (!is_special_request) {
      const partSource = await this.linked_repositories.purchasement_source.findOne({ commercial_number });
      if (!partSource) throw new NotFoundException(`Purchasement Source with commercial number == "${commercial_number}" doesn't exist`);
    }
    return this.linked_repositories.purchasement_request.createPurchasementRequest(createPurchasementRequestDTO);
  }

  async removePurchasementRequest(id: number) {
    const removal = await this.linked_repositories.purchasement_request.delete(id);
    if (!removal.affected) throw new NotFoundException(`Purchasement Reqiest with id == "${id}" doesn't exist`);
    return removal;
  }

  async getAllPurchasementRequest(paginationDTO: PaginationDto) {
    return this.linked_repositories.purchasement_request.getAllPurchasementRequest(paginationDTO);
  }
  async clientConfirmationTheRequestOrder(confirmation_token: string) {
    const PRequest = await this.linked_repositories.purchasement_request.findOne({ confirmation_token });
    if (!PRequest || PRequest.being_confirmed) throw new NotFoundException(); // not found -> means already confirm
    PRequest.being_confirmed = true;
    return await PRequest.save();
  }
  // ────────────────────────────────────────────────────────────────────────────────
}
