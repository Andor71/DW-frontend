import { YearDto } from './year.model';

export class DocumentDto {
  documentId: number;
  name: string;
  path: string;
  year: YearDto;
}

export class DocumentResponseDto {
  yearDto: YearDto;
  documents: Array<DocumentDto>;
}
