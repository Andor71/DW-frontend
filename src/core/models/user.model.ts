import { MajorDto } from "./major.model";

export class UserDto {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  role: string;
  active: boolean;
  email: string;
  majorDto:MajorDto
  infoName?: string;
  media?: number;
}
