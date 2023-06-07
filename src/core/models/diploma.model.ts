import { DiplomaStages } from '../enums/diploma.enums';
import { PeriodDto } from './Period.model';
import { UserDto } from './user.model';

export class DiplomaDto {
  diplomaId: number;
  title: string;
  periods: Array<PeriodDto>;
  student: UserDto;
  score: number;
  stage: DiplomaStages;
  visibility: number;
  keywords: string;
  type: string;
  taken: boolean;
  abstractName: string;
  description: string;
  abstractDoc?: FormData;
  applied?: Boolean;
  enabled?: Boolean;
  bibliography: string;
  details: string;
  necessaryKnowledge: string;
  differentExpectations: string;
  teachers: Array<UserDto>;
}

export class ScoreDto {
  id: number;
  score: number;
}
