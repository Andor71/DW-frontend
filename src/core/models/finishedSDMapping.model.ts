import { DiplomaDto } from './diploma.model';
import { UserDto } from './user.model';

export class FinishedSDMappingDto {
  id: number;
  diploma: DiplomaDto;
  student: UserDto;
  accepted: boolean;
}
