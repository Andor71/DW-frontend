import { PeriodDto } from './Period.model';
import { UserDto } from './user.model';

export class DiplomaDto {
  diplomaId: number;
  title: string;
  period: PeriodDto;
  student: UserDto;
  score: number;
  stage: string;
  teacher: UserDto;
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
}
