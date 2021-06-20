import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { CreatePurchasementPartDetailDTO } from './dto/create-purchasement-part-detail.dto';
import { CreatePurchasementRequestDTO } from './dto/create-purchasement-request.dto';
import { CreatePurchasementSourceDTO } from './dto/create-purchasement-source.dto';
import { PurchansementPartRepository } from './purchasement-part.repository';
import { PurchasementRequestRepository } from './purchasement-request.repository';
import { PurchasementSourceRepository } from './purchasement-source.repository';
import { join } from 'path';
import { CreateResponseToPurchasementRequest } from './dto/create-response-to-purchasement-request.dto';
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
    private readonly mailerService: MailerService,
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

  async getSourceData(id: number) {
    const [result] = await this.linked_repositories.purchasement_source.query(
      `SELECT p_s.*,p_p.part_name from public.purchasement_source p_s LEFT JOIN public.purchasement_part p_p ON p_s.part_number=p_p.part_number WHERE p_s.id=${id} LIMIT 1`,
    );
    if (!result) throw new NotFoundException(`Purchasement source with id of "${id}" doesn't exist in the database`);
    return result;
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── PURCHASEMENT ───────────────────────────────────────────────────────────────
  //
  async createPurchasementRequest(createPurchasementRequestDTO: CreatePurchasementRequestDTO) {
    const { is_special_request, commercial_number, price, quantity } = createPurchasementRequestDTO;
    if (!is_special_request) {
      /*const partSource = await this.linked_repositories.purchasement_source.findOne({ commercial_number });
      if (!partSource) throw new NotFoundException(`Purchasement Source with commercial number == "${commercial_number}" doesn't exist`);*/

      const [result] = await this.linked_repositories.purchasement_source.query(
        `SELECT p_s.*,p_p.part_name from public.purchasement_source p_s LEFT JOIN public.purchasement_part p_p ON p_s.part_number=p_p.part_number WHERE p_s.commercial_number='${commercial_number}' LIMIT 1`,
      );
      if (!result) throw new NotFoundException(`Purchasement source with id of "${commercial_number}" doesn't exist in the database`);
      return this.linked_repositories.purchasement_request.createPurchasementRequest(createPurchasementRequestDTO, result).then((data) => {
        this.mailerService.sendMail({
          to: 'tanawatt2541@gmail.com', //TODO changed to the destination one
          from: 'thiti.mwk.main@gmail.com',
          subject: 'คำร้องขอการสั่งซื้อ',
          template: join(__dirname, '..', '..', 'shared', 'templates', 'mailer', 'purchasement_confirmation'),
          context: {
            part_name: result.part_name,
            part_number: result.part_number,
            quantity: quantity,
            price: price,
            token: data.confirmation_token,
            company: result.company,
            seller: result.seller,
            contact_number: result.contact_number,
            email: result.email,
            prefix1: 'ล่าง',
            prefix2: 'ติดต่อสอบถาม',
            dest_path: `http://localhost:3001/purchasement-tracking/${data.confirmation_token}/?type=client`,
          },
        });
      });
    }
  }

  async removePurchasementRequest(id: number) {
    const removal = await this.linked_repositories.purchasement_request.delete(id);
    if (!removal.affected) throw new NotFoundException(`Purchasement Reqiest with id == "${id}" doesn't exist`);
    return removal;
  }

  async getAllPurchasementRequest(paginationDTO: PaginationDto) {
    return this.linked_repositories.purchasement_request.getAllPurchasementRequest(paginationDTO);
  }
  async getPurchasementRequest(confirmation_token: string) {
    const PRequest = await this.linked_repositories.purchasement_request.findOne({ confirmation_token });
    if (!PRequest) throw new NotFoundException(); // not found -> means already confirm
    return PRequest;
  }
  async clientConfirmationTheRequestOrder(confirmation_token: string) {
    const PRequest = await this.linked_repositories.purchasement_request.findOne({ confirmation_token });
    if (!PRequest || PRequest.being_confirmed) throw new NotFoundException(); // not found -> means already confirm
    PRequest.being_confirmed = true;
    return await PRequest.save();
  }

  async clientResponseToPurchasementRequest(createResponseToPurchasementRequest: CreateResponseToPurchasementRequest, confirmation_token: string) {
    const { accept } = createResponseToPurchasementRequest;
    const PRequest = await this.linked_repositories.purchasement_request.findOne({ confirmation_token });
    if (!PRequest || PRequest.is_order_accepted !== null || PRequest.purchasement_successfully !== false) throw new NotFoundException(); // not found -> means already confirm or in progress
    PRequest.is_order_accepted = accept;
    return await PRequest.save();
  }

  async employeeClosePurchasementRequest(confirmation_token: string) {
    const PRequest = await this.linked_repositories.purchasement_request.findOne({ confirmation_token });
    if (!PRequest || PRequest.is_order_accepted !== true || PRequest.purchasement_successfully !== false) throw new NotFoundException();
    PRequest.purchasement_successfully = true;
    return await PRequest.save();
  }

  async clientAttachEvidenceToPurchasementRequest(confirmation_token: string, evidence_path: string) {
    const PRequest = await this.linked_repositories.purchasement_request.findOne({ confirmation_token, delivery_attachments: null });
    if (!PRequest) throw new NotFoundException();
    PRequest.delivery_attachments = evidence_path;
    return await PRequest.save();
  }

  async employeeAttachEvidenceToPurchasementRequest(confirmation_token: string, evidence_path: string) {
    const PRequest = await this.linked_repositories.purchasement_request.findOne({ confirmation_token, payment_attachments: null });
    if (!PRequest) throw new NotFoundException();
    PRequest.payment_attachments = evidence_path;
    return await PRequest.save();
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── TEST ───────────────────────────────────────────────────────────────────────
  //
  async sendMail() {
    return this.mailerService
      .sendMail({
        to: 'tanawatt2541@gmail.com',
        from: 'thiti.mwk.main@gmail.com',
        subject: 'Yooloo',
        template: join(__dirname, '..', '..', 'shared', 'templates', 'mailer', 'purchasement_confirmation'),
        context: {
          part_name: 'ตะปูเหล็ก',
          quantity: '10 โหล',
          price: 3000,
          token: '3a6b7c',
        },
      })
      .then(() => {
        console.log('mail successfully sent');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // ────────────────────────────────────────────────────────────────────────────────
}
