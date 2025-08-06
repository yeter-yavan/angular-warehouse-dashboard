export interface Job {
  id: string;
  sku: string;
  status: JobStatus;
  assignedUser: string;
  createdDate: Date;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  location?: string;
  estimatedCompletion?: Date;
}

export type JobStatus = 'Pending' | 'In Progress' | 'Completed';

export interface JobFilter {
  status?: JobStatus;
  startDate?: Date;
  endDate?: Date;
  assignedUser?: string;
}

export interface JobUpdateRequest {
  id: string;
  status: JobStatus;
  assignedUser?: string;
} 