import { UserStatus } from '../enums/user.enums';
import { DepartmentDto } from './department.model';
import { MajorDto } from './major.model';

export class UserDto {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  role: string;
  active: boolean;
  email: string;
  majorDto: MajorDto;
  infoName?: string;
  media?: number;
  status?: UserStatus;
  token?: string;
  department?: DepartmentDto;
}

export class PasswordDto {
  password: string;
  validationCode: string;
}
