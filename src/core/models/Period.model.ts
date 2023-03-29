import { MajorDto } from './major.model';
import { YearDto } from './year.model';

export class PeriodDto {
  periodId: number;
  major: MajorDto;
  year: YearDto;
  startOfEnteringTopics: Date;
  endOfEnteringTopics: Date;
  firstTopicAdvertisement: Date;
  firstTopicAdvertisementEnd: Date;
  firstAllocation: Date;
  secondTopicAdvertisement: Date;
  secondTopicAdvertisementEnd: Date;
  secondAllocation: Date;
  implementationOfTopics: Date;
  documentumUpload: Date;
  diplomaDefend: Date;
}

export class PeriodsByYear {
  year: YearDto;
  periods: Array<PeriodDto>;
}
