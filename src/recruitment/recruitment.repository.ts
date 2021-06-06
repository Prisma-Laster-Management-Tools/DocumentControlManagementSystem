import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { getRandomString } from 'src/utilities/random/string';

import { EntityRepository, Repository } from 'typeorm';
import { CreateRecruitmentRegistrationSessionDTO } from './dto/create-recruitment-registration-session.dto';
import { Recruitment } from './model/recruitment.entity';
@EntityRepository(Recruitment)
export class RecruitmentRepository extends Repository<Recruitment> {
  private logger = new Logger();

  async generateRecruitmentRegistrationSession(createRecruitmentRegistrationSessionDTO: CreateRecruitmentRegistrationSessionDTO) {
    let random_access_token;
    while (true) {
      random_access_token = getRandomString(10);

      //check-in
      const existed_sesson = await this.findOne({ access_token: random_access_token });
      if (!existed_sesson) break; // break if it's not exist
    }

    const { firstname, lastname, role } = createRecruitmentRegistrationSessionDTO;
    const Rm = new Recruitment();
    Rm.firstname = firstname;
    Rm.lastname = lastname;
    Rm.role = role;
    Rm.access_token = random_access_token;
    return await Rm.save();
  }
}
