export enum VisitStatus {
  CONFIRMED = 'rendez-vous confirmé',
  PENDING = 'Etude en cours',
  POSITIVE = 'Positif',
  NEGATIVE = 'Négatif',
  SECOND_VISIT = 'rendez-vous de seconde visite',
}

export class CreateVisitDto {
  customer_id: string;
  employee_id: string;
  status: VisitStatus;
}

export class VisitDto extends CreateVisitDto {
  id: string;
  visitDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
