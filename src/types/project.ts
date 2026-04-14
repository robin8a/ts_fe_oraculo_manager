export interface Project {
  id: string;
  name: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectInput {
  name: string;
  status: string;
}

export interface UpdateProjectInput {
  id: string;
  name?: string;
  status?: string;
}

