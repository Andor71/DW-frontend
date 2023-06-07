import { DiplomaFileTypeEnum } from '../enums/diplomafiletype.enums';
import { DiplomaDto } from './diploma.model';
import { UserDto } from './user.model';

export class DiplomaFileDto {
  diplomaFilesId: number;
  title: string;
  diploma: DiplomaDto;
  type: DiplomaFileTypeEnum;
  path: string;
  visibility: number;
  author: UserDto;
}
