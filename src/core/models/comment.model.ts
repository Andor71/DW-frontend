import { DiplomaDto } from './diploma.model';
import { UserDto } from './user.model';

export class CommentDto {
  commentId: number;
  message: string;
  diploma: DiplomaDto;
  user: UserDto;
  score: number;
  date: Date;
  viewed: Boolean;
}
