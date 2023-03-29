import { YearDto } from './year.model';

export class MajorDto {
  majorId: number;
  year: string;
  programme: string;
  diplomaType: string;
  yearDto: YearDto;
}

export class AllMajorDto {
  year: YearDto;
  majors: Array<MajorDto>;
}
