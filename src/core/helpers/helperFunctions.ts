import { DiplomaStages } from '../enums/diploma.enums';

export function getDiplomaStage(
  diplomaStages: DiplomaStages
): string {
  switch (diplomaStages) {
    case DiplomaStages.PLAN:
      return 'PLAN';
    case DiplomaStages.UNDER_IMPLEMENTATION:
      return 'UNDER_IMPLEMENTATION';
    case DiplomaStages.FINISHED:
      return 'FINISHED';
    default:
      return 'Unknown';
  }
}
