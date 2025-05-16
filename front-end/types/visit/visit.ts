export type Visit = {
  id: string;
  customerId: string;
  employeeId: string;
  status: VisitStatus;
  createdAt: string;
  updatedAt: string;
};

export enum VisitStatus {
  CONFIRMED = "rendez-vous confirmé",
  PENDING = "Etude en cours",
  POSITIVE = "Positif",
  NEGATIVE = "Négatif",
  SECOND_VISIT = "rendez-vous de seconde visite",
}
