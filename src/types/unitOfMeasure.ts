export interface UnitOfMeasure {
  id: string;
  name: string;
  abbreviation?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUnitOfMeasureInput {
  name: string;
  abbreviation?: string | null;
}

export interface UpdateUnitOfMeasureInput {
  id: string;
  name?: string;
  abbreviation?: string | null;
}

